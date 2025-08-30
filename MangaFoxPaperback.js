import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagType,
    TagSection,
    ContentRating,
    SourceIntents,
    BadgeColor
} from '@paperback/types'

const MANGAFOX_DOMAIN = 'https://fanfox.net'
const MOBILE_DOMAIN = 'https://m.fanfox.net'

export const MangaFoxInfo: SourceInfo = {
    version: '1.0.0',
    name: 'MangaFox',
    icon: 'icon.png',
    author: 'TachiyomiExtensionAdapter',
    authorWebsite: 'https://github.com/timschneeb/tachiyomi-extensions-archive',
    description: 'Extension for MangaFox adapted from Tachiyomi',
    websiteBaseURL: MANGAFOX_DOMAIN,
    contentRating: ContentRating.MATURE,
    sourceTags: [
        {
            text: 'Cloudflare',
            type: BadgeColor.RED
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
}

export class MangaFox extends Source {
    baseUrl = MANGAFOX_DOMAIN
    mobileUrl = MOBILE_DOMAIN

    requestManager = createRequestManager({
        requestsPerSecond: 1,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request) => {
                request.headers = {
                    ...request.headers,
                    'referer': `${this.baseUrl}/`,
                    'user-agent': await this.requestManager.getDefaultUserAgent()
                }
                return request
            },
            interceptResponse: async (response) => {
                return response
            }
        }
    })

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const title = $('.detail-info-right-title-font').text().trim()
        const image = $('.detail-info-cover-img').attr('src') || ''
        const author = $('.detail-info-right-say a').map((_, el) => $(el).text()).get().join(', ')
        const description = $('.fullcontent').text().trim()
        const status = this.parseStatus($('.detail-info-right-title-tip').text())
        const genres = $('.detail-info-right-tag-list a').map((_, el) => $(el).text()).get()

        return createManga({
            id: mangaId,
            titles: [title],
            image: image.startsWith('http') ? image : `${this.baseUrl}${image}`,
            rating: 0,
            status: status,
            author: author,
            artist: author,
            tags: [
                createTagSection({
                    id: '0',
                    label: 'Genres',
                    tags: genres.map(genre => createTag({
                        id: genre.toLowerCase().replace(/\s+/g, '-'),
                        label: genre
                    }))
                })
            ],
            desc: description
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const chapters: Chapter[] = []
        
        $('.detail-main-list li a').each((_, element) => {
            const chapterUrl = $(element).attr('href') || ''
            const chapterName = $('.detail-main-list-main p', element).first().text().trim()
            const dateText = $('.detail-main-list-main p', element).last().text().trim()
            
            if (chapterUrl && chapterName) {
                const chapterId = chapterUrl.split('/').pop() || ''
                const chapterNumber = this.extractChapterNumber(chapterName)
                const date = this.parseChapterDate(dateText)

                chapters.push(createChapter({
                    id: chapterId,
                    mangaId: mangaId,
                    name: chapterName,
                    chapNum: chapterNumber,
                    time: date,
                    langCode: 'en'
                }))
            }
        })

        return chapters.reverse() // Reverse to get ascending order
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const mobilePath = `/roll_manga/${chapterId}`
        const request = createRequestObject({
            url: `${this.mobileUrl}${mobilePath}`,
            method: 'GET',
            headers: {
                'referer': `${this.mobileUrl}/`
            }
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const pages: string[] = []
        
        $('#viewer img').each((_, element) => {
            const imageUrl = $(element).attr('data-original') || $(element).attr('src') || ''
            if (imageUrl) {
                pages.push(imageUrl.startsWith('http') ? imageUrl : `${this.mobileUrl}${imageUrl}`)
            }
        })

        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const request = createRequestObject({
            url: `${this.baseUrl}/directory/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const popularManga: PartialSourceManga[] = []
        
        $('.manga-list-1-list li').each((_, element) => {
            const linkElement = $('a', element).first()
            const url = linkElement.attr('href') || ''
            const title = linkElement.attr('title') || ''
            const image = $('img', linkElement).attr('src') || ''
            
            if (url && title) {
                const mangaId = url.split('/').pop() || ''
                popularManga.push(createPartialSourceManga({
                    mangaId: mangaId,
                    image: image.startsWith('http') ? image : `${this.baseUrl}${image}`,
                    title: title
                }))
            }
        })

        const popularSection = createHomeSection({
            id: 'popular',
            title: 'Popular Manga',
            items: popularManga,
            type: HomeSectionType.singleRowNormal
        })

        sectionCallback(popularSection)

        // Latest Updates
        const latestRequest = createRequestObject({
            url: `${this.baseUrl}/directory/?latest`,
            method: 'GET'
        })

        const latestResponse = await this.requestManager.schedule(latestRequest, 1)
        const $latest = this.cheerio.load(latestResponse.data)

        const latestManga: PartialSourceManga[] = []
        
        $('.manga-list-1-list li', $latest).each((_, element) => {
            const linkElement = $('a', element).first()
            const url = linkElement.attr('href') || ''
            const title = linkElement.attr('title') || ''
            const image = $('img', linkElement).attr('src') || ''
            
            if (url && title) {
                const mangaId = url.split('/').pop() || ''
                latestManga.push(createPartialSourceManga({
                    mangaId: mangaId,
                    image: image.startsWith('http') ? image : `${this.baseUrl}${image}`,
                    title: title
                }))
            }
        })

        const latestSection = createHomeSection({
            id: 'latest',
            title: 'Latest Updates',
            items: latestManga,
            type: HomeSectionType.singleRowNormal
        })

        sectionCallback(latestSection)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        let url = ''

        switch (homepageSectionId) {
            case 'popular':
                url = `${this.baseUrl}/directory/${page > 1 ? `${page}.html` : ''}`
                break
            case 'latest':
                url = `${this.baseUrl}/directory/${page > 1 ? `${page}.html` : ''}?latest`
                break
            default:
                throw new Error(`Invalid homepage section ID: ${homepageSectionId}`)
        }

        const request = createRequestObject({
            url: url,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga: PartialSourceManga[] = []
        
        $('.manga-list-1-list li').each((_, element) => {
            const linkElement = $('a', element).first()
            const url = linkElement.attr('href') || ''
            const title = linkElement.attr('title') || ''
            const image = $('img', linkElement).attr('src') || ''
            
            if (url && title) {
                const mangaId = url.split('/').pop() || ''
                manga.push(createPartialSourceManga({
                    mangaId: mangaId,
                    image: image.startsWith('http') ? image : `${this.baseUrl}${image}`,
                    title: title
                }))
            }
        })

        const hasNextPage = $('.pager-list-left a.active + a + a').length > 0
        
        return createPagedResults({
            results: manga,
            metadata: hasNextPage ? { page: page + 1 } : undefined
        })
    }

    async getSearchResults(searchQuery: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        const query = searchQuery.title || ''
        
        let searchUrl = `${this.baseUrl}/search?title=${encodeURIComponent(query)}`
        
        // Add genre filters if present
        const includedGenres: string[] = []
        const excludedGenres: string[] = []
        
        searchQuery.includedTags?.forEach(tag => {
            if (tag.id.startsWith('genre-')) {
                includedGenres.push(tag.id.replace('genre-', ''))
            }
        })
        
        searchQuery.excludedTags?.forEach(tag => {
            if (tag.id.startsWith('genre-')) {
                excludedGenres.push(tag.id.replace('genre-', ''))
            }
        })
        
        if (includedGenres.length > 0) {
            searchUrl += `&genres=${includedGenres.join(',')}`
        }
        
        if (excludedGenres.length > 0) {
            searchUrl += `&nogenres=${excludedGenres.join(',')}`
        }

        const request = createRequestObject({
            url: searchUrl,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga: PartialSourceManga[] = []
        
        $('.manga-list-4-list li').each((_, element) => {
            const linkElement = $('a', element).first()
            const url = linkElement.attr('href') || ''
            const title = linkElement.attr('title') || ''
            const image = $('img', linkElement).attr('src') || ''
            
            if (url && title) {
                const mangaId = url.split('/').pop() || ''
                manga.push(createPartialSourceManga({
                    mangaId: mangaId,
                    image: image.startsWith('http') ? image : `${this.baseUrl}${image}`,
                    title: title
                }))
            }
        })

        const hasNextPage = $('.pager-list-left a.active + a + a').length > 0
        
        return createPagedResults({
            results: manga,
            metadata: hasNextPage ? { page: page + 1 } : undefined
        })
    }

    async getSearchTags(): Promise<TagSection[]> {
        return [
            createTagSection({
                id: 'genres',
                label: 'Genres',
                tags: [
                    createTag({ id: 'genre-action', label: 'Action' }),
                    createTag({ id: 'genre-adventure', label: 'Adventure' }),
                    createTag({ id: 'genre-comedy', label: 'Comedy' }),
                    createTag({ id: 'genre-drama', label: 'Drama' }),
                    createTag({ id: 'genre-fantasy', label: 'Fantasy' }),
                    createTag({ id: 'genre-martial-arts', label: 'Martial Arts' }),
                    createTag({ id: 'genre-shounen', label: 'Shounen' }),
                    createTag({ id: 'genre-horror', label: 'Horror' }),
                    createTag({ id: 'genre-supernatural', label: 'Supernatural' }),
                    createTag({ id: 'genre-harem', label: 'Harem' }),
                    createTag({ id: 'genre-psychological', label: 'Psychological' }),
                    createTag({ id: 'genre-romance', label: 'Romance' }),
                    createTag({ id: 'genre-school-life', label: 'School Life' }),
                    createTag({ id: 'genre-shoujo', label: 'Shoujo' }),
                    createTag({ id: 'genre-mystery', label: 'Mystery' }),
                    createTag({ id: 'genre-sci-fi', label: 'Sci-fi' }),
                    createTag({ id: 'genre-seinen', label: 'Seinen' }),
                    createTag({ id: 'genre-tragedy', label: 'Tragedy' }),
                    createTag({ id: 'genre-ecchi', label: 'Ecchi' }),
                    createTag({ id: 'genre-sports', label: 'Sports' }),
                    createTag({ id: 'genre-slice-of-life', label: 'Slice of Life' }),
                    createTag({ id: 'genre-mature', label: 'Mature' }),
                    createTag({ id: 'genre-shoujo-ai', label: 'Shoujo Ai' }),
                    createTag({ id: 'genre-webtoons', label: 'Webtoons' }),
                    createTag({ id: 'genre-doujinshi', label: 'Doujinshi' }),
                    createTag({ id: 'genre-one-shot', label: 'One Shot' }),
                    createTag({ id: 'genre-smut', label: 'Smut' }),
                    createTag({ id: 'genre-yaoi', label: 'Yaoi' }),
                    createTag({ id: 'genre-josei', label: 'Josei' }),
                    createTag({ id: 'genre-historical', label: 'Historical' }),
                    createTag({ id: 'genre-shounen-ai', label: 'Shounen Ai' }),
                    createTag({ id: 'genre-gender-bender', label: 'Gender Bender' }),
                    createTag({ id: 'genre-adult', label: 'Adult' }),
                    createTag({ id: 'genre-yuri', label: 'Yuri' }),
                    createTag({ id: 'genre-mecha', label: 'Mecha' })
                ]
            })
        ]
    }

    // Helper methods
    private parseStatus(statusText: string): MangaStatus {
        const status = statusText.toLowerCase()
        if (status.includes('ongoing')) {
            return MangaStatus.ONGOING
        } else if (status.includes('completed')) {
            return MangaStatus.COMPLETED
        }
        return MangaStatus.UNKNOWN
    }

    private extractChapterNumber(chapterName: string): number {
        const match = chapterName.match(/chapter\s*(\d+(?:\.\d+)?)/i)
        return match ? parseFloat(match[1]) : 0
    }

    private parseChapterDate(dateText: string): Date {
        if (dateText.includes('Today') || dateText.includes('ago')) {
            return new Date()
        } else if (dateText.includes('Yesterday')) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            return yesterday
        } else {
            // Try to parse date in format "MMM d,yyyy"
            const date = new Date(dateText)
            return isNaN(date.getTime()) ? new Date() : date
        }
    }

    getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/manga/${mangaId}`
    }
}

