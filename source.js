          subtitle: decodeHTML2(subtitle)
        }));
      }
      popularSection.items = Popular;
      sectionCallback(popularSection);
      for (const obj of $2(".latest_list div", $2(".right div:contains(TODAY'S MANGA)").next()).toArray()) {
        const id = $2("a.image", obj).attr("href")?.split("/").pop() ?? "";
        const title = $2("a.name", obj).text().trim() ?? "";
        const image = `${cdnUrl}/manga_images/${id.toLowerCase()}.jpg`;
        const subtitle = $2(".chapter_box a", obj).text().trim();
        if (!id) continue;
        TodayManga.push(App.createPartialSourceManga({
          image,
          title: decodeHTML2(title),
          mangaId: id,
          subtitle: decodeHTML2(subtitle)
        }));
      }
      TodayMangaSection.items = TodayManga;
      sectionCallback(TodayMangaSection);
      for (const obj of $2(".latest_list div", $2(".right div:contains(YESTERDAY'S MANGA)").next()).toArray()) {
        const id = $2("a.image", obj).attr("href")?.split("/").pop() ?? "";
        const title = $2("a.name", obj).text().trim() ?? "";
        const image = `${cdnUrl}/manga_images/${id.toLowerCase()}.jpg`;
        const subtitle = $2(".chapter_box a", obj).text().trim();
        if (!id) continue;
        YesterdayManga.push(App.createPartialSourceManga({
          image,
          title: decodeHTML2(title),
          mangaId: id,
          subtitle: decodeHTML2(subtitle)
        }));
      }
      YesterdayMangaSection.items = YesterdayManga;
      sectionCallback(YesterdayMangaSection);
      for (const obj of $2(".latest_list div", $2(".right div:contains(OLDER MANGA)").next()).toArray()) {
        const id = $2("a.image", obj).attr("href")?.split("/").pop() ?? "";
        const title = $2("a.name", obj).text().trim() ?? "";
        const image = `${cdnUrl}/manga_images/${id.toLowerCase()}.jpg`;
        const subtitle = $2(".chapter_box a", obj).text().trim();
        if (!id) continue;
        OlderManga.push(App.createPartialSourceManga({
          image,
          title: decodeHTML2(title),
          mangaId: id,
          subtitle: decodeHTML2(subtitle)
        }));
      }
      OlderMangaSection.items = OlderManga;
      sectionCallback(OlderMangaSection);
    }
    ViewMoreParse($2, cdnUrl, isPopular) {
      const results = [];
      for (const obj of $2(isPopular ? ".ranking_list .ranking_item" : ".latest_releases_list .latest_releases_item").toArray()) {
        const id = $2("a", obj).attr("href")?.split("/").pop() ?? "";
        const title = $2("a h3, a strong", obj).text().trim() ?? "";
        const image = `${cdnUrl}/manga_images/${id.toLowerCase()}.jpg`;
        const subtitle = isPopular ? $2(".ranking_item_info div:contains(Published)", obj).text().trim().split(" ").shift() ?? "" : $2(".latest_releases_info div a", obj).first().text().trim().split(" ").pop() ?? "";
        if (!id) continue;
        results.push(App.createPartialSourceManga({
          image,
          title: decodeHTML2(title),
          mangaId: id,
          subtitle: decodeHTML2(subtitle ? `Chapter ${subtitle}` : "")
        }));
      }
      return results;
    }
    parseSearchResults($2, cdnUrl, UsesDeatils) {
      const results = [];
      for (const obj of $2(UsesDeatils ? ".ranking_list .ranking_item" : "div.manga_search_item, div.mangaka_search_item").toArray()) {
        const id = $2("h3 a, h5 a, a", obj).attr("href")?.split("/").pop() ?? "";
        const title = $2("h3 a, h5 a, a h3", obj).text() ?? "";
        const image = `${cdnUrl}/manga_images/${id.toLowerCase()}.jpg`;
        const subtitle = $2("div:contains(Published), .ranking_item_info div:contains(Published)", obj).text().trim().split(" ").shift();
        if (!id) continue;
        results.push(App.createPartialSourceManga({
          image,
          title: decodeHTML2(title),
          mangaId: id,
          subtitle: decodeHTML2(subtitle ? `Chapter ${subtitle}` : "")
        }));
      }
      return results;
    }
    parseChapterDetails($2, mangaId, chapterId) {
      const pages = [];
      for (const obj of $2("img#gohere").toArray()) {
        const page = this.getImageSrc($2(obj)) ?? "";
        if (!page) {
          throw new Error(`Could not parse page for ${chapterId}`);
        }
        pages.push(page);
      }
      return App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages
      });
    }
    parseChapters($2) {
      const chapters = [];
      const arrChapters = $2("div.manga_series_list tr:has(a)").toArray();
      for (const obj of arrChapters) {
        const id = $2("a", obj).attr("href")?.split("/").pop() ?? "";
        const name = $2("td", obj).eq(0).text().trim() ?? "";
        const release_date = $2("td", obj).eq(1).text();
        if (!id) continue;
        const match = name.match(this.chapterTitleRegex);
        let chapNum;
        if (match && !isNaN(Number(match[1]))) chapNum = Number(match[1]);
        chapters.push(App.createChapter({
          id,
          name: this.encodeText(name),
          chapNum: chapNum ?? 0,
          time: new Date(release_date),
          langCode: "\u{1F1EC}\u{1F1E7}"
        }));
      }
      return chapters;
    }
    parseMangaDetails($2, mangaId, cdnUrl) {
      const title = $2("div.manga_series_data h1").first().text().trim() ?? "";
      const image = `${cdnUrl}/manga_images/${mangaId.toLowerCase()}.jpg`;
      const author = $2("div.manga_series_data > div").eq(2).text().trim() ?? "";
      const artist = $2("div.manga_series_data > div").eq(3).text().trim() ?? "";
      const status = $2("div.manga_series_data > div").eq(1).text().trim() ?? "";
      const arrayTags = [];
      for (const obj of $2("div.series_sub_genre_list a").toArray()) {
        const id = $2(obj)?.attr("href")?.split("/").pop() ?? "";
        const label = $2(obj).text() ?? "";
        if (!id || !label) continue;
        arrayTags.push({
          id: `details.${id}`,
          label
        });
      }
      let desc = $2("div.manga_series_description p").text().trim() ?? "";
      if (desc == "") desc = "No Decscription provided by the source (MangaFreak)";
      return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
          titles: [decodeHTML2(title)],
          image,
          status: this.parseStatus(status),
          author: decodeHTML2(author),
          artist: decodeHTML2(artist),
          tags: [App.createTagSection({ id: "0", label: "genres", tags: arrayTags.map((x) => App.createTag(x)) })],
          desc
        })
      });
    }
    parseTags($2) {
      const genres = [];
      for (const obj of $2('.main .select_genre div[id="genrebox"] div').toArray()) {
        const id = $2(obj).text().trim();
        const label = $2(obj).text().trim();
        if (!id || !label)
          continue;
        genres.push({
          id: `genre.${id}`,
          label
        });
      }
      const Types = [
        {
          id: "types.0",
          label: "Both"
        },
        {
          id: "types.2",
          label: "Manga"
        },
        {
          id: "types.1",
          label: "Manhwa"
        }
      ];
      const Status = [
        {
          id: "status.0",
          label: "Both"
        },
        {
          id: "status.1",
          label: "Completed"
        },
        {
          id: "status.2",
          label: "Ongoing"
        }
      ];
      return [
        App.createTagSection({ id: "none", label: "Using multipule genres tags without", tags: [] }),
        App.createTagSection({ id: "none2", label: "title the search will infinitely loop", tags: [] }),
        App.createTagSection({ id: "none3", label: "but if it's one tag it will work", tags: [] }),
        App.createTagSection({ id: "1", label: "Genres", tags: genres.map((x) => App.createTag(x)) }),
        App.createTagSection({ id: "2", label: "Manga Type", tags: Types.map((x) => App.createTag(x)) }),
        App.createTagSection({ id: "3", label: "Manga Status", tags: Status.map((x) => App.createTag(x)) })
      ];
    }
    NextPage($2) {
      const nextPage = $2("a.next_p");
      if (nextPage.contents().length !== 0) {
        return true;
      } else {
        return false;
      }
    }
    encodeText(str) {
      return str.replace(/&#([0-9]{1,4})/gi, (_, numStr) => {
        const num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      });
    }
    getImageSrc(imageObj) {
      let image;
      if (typeof imageObj?.attr("data-src") != "undefined") {
        image = imageObj?.attr("data-src");
      } else if (typeof imageObj?.attr("data-lazy-src") != "undefined") {
        image = imageObj?.attr("data-lazy-src");
      } else if (typeof imageObj?.attr("srcset") != "undefined") {
        image = imageObj?.attr("srcset")?.split(" ")[0] ?? "";
      } else if (typeof imageObj?.attr("data-cfsrc") != "undefined") {
        image = imageObj?.attr("data-cfsrc")?.split(" ")[0] ?? "";
      } else {
        image = imageObj?.attr("src");
      }
      return encodeURI(decodeURI(decodeHTML2(image?.trim() ?? "")));
    }
    parseStatus(str) {
      let status = "ONGOING";
      switch (str.toLowerCase()) {
        case "ongoing":
        case "on-going":
          status = "ONGOING";
          break;
        case "completed":
          status = "COMPLETED";
          break;
      }
      return status;
    }
  };

  // src/MangaFreak/MangaFreak.ts
  var MangaFreak_BASE = "https://ww1.mangafreak.me/";
  var MangaFreak_CDN = "https://images.mangafreak.me";
  var MangaFreakInfo = {
    author: "xOnlyFadi",
    description: "Extension that pulls manga from mangafreak.net",
    icon: "icon.png",
    name: "MangaFreak",
    version: "2.0.7",
    authorWebsite: "https://github.com/xOnlyFadi",
    websiteBaseURL: MangaFreak_BASE,
    contentRating: import_types3.ContentRating.EVERYONE,
    intents: import_types3.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | import_types3.SourceIntents.HOMEPAGE_SECTIONS | import_types3.SourceIntents.MANGA_CHAPTERS,
    language: "English",
    sourceTags: [
      {
        text: "Cloudflare",
        type: import_types3.BadgeColor.RED
      }
    ]
  };
  var MangaFreak = class _MangaFreak {
    constructor() {
      this.parser = new Parser3();
      this.baseUrl = MangaFreak_BASE;
      this.baseCdn = MangaFreak_CDN;
      this.requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 45e3,
        interceptor: {
          interceptRequest: async (request) => {
            request.headers = {
              ...request.headers ?? {},
              ...{
                "user-agent": await this.requestManager.getDefaultUserAgent(),
                "referer": `${MangaFreak_BASE}/`
              }
            };
            return request;
          },
          interceptResponse: async (response) => {
            return response;
          }
        }
      });
    }
    getMangaShareUrl(mangaId) {
      return `${MangaFreak_BASE}/Manga/${mangaId}`;
    }
    async getCloudflareBypassRequestAsync() {
      return App.createRequest({
        url: `${MangaFreak_BASE}/Mangalist`,
        method: "GET",
        headers: {
          "referer": `${this.baseUrl}/`,
          "user-agent": await this.requestManager.getDefaultUserAgent()
        }
      });
    }
    async getHomePageSections(sectionCallback) {
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      const $2 = load(response.data);
      this.CloudFlareError(response.status);
      return this.parser.parseHomeSections($2, sectionCallback, MangaFreak_CDN);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
      const page = metadata?.page ?? 1;
      let param = "";
      let isPopular = false;
      switch (homepageSectionId) {
        case "popular":
          param = `Genre/All/${page}`;
          isPopular = true;
          break;
        case "today_manga":
          param = `Latest_Releases/${page}`;
          break;
        default:
          throw new Error(`Invalid homeSectionId | ${homepageSectionId}`);
      }
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/${param}`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      const $2 = load(response.data);
      this.CloudFlareError(response.status);
      const manga = this.parser.ViewMoreParse($2, MangaFreak_CDN, isPopular);
      metadata = this.parser.NextPage($2) ? { page: page + 1 } : void 0;
      return App.createPagedResults({
        results: manga,
        metadata
      });
    }
    async getSearchTags() {
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/Find`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      this.CloudFlareError(response.status);
      const $2 = load(response.data);
      return this.parser.parseTags($2);
    }
    async getMangaDetails(mangaId) {
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/Manga/${mangaId}`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      this.CloudFlareError(response.status);
      const $2 = load(response.data);
      return this.parser.parseMangaDetails($2, mangaId, MangaFreak_CDN);
    }
    async getChapters(mangaId) {
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/Manga/${mangaId}`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      this.CloudFlareError(response.status);
      const $2 = load(response.data);
      return this.parser.parseChapters($2);
    }
    async getChapterDetails(mangaId, chapterId) {
      const request = App.createRequest({
        url: `${MangaFreak_BASE}/${chapterId}`,
        method: "GET"
      });
      const response = await this.requestManager.schedule(request, 1);
      this.CloudFlareError(response.status);
      const $2 = load(response.data);
      return this.parser.parseChapterDetails($2, mangaId, chapterId);
    }
    async getSearchResults(query, metadata) {
      const page = metadata?.page ?? 1;
      let UsesDeatils = false;
      let request;
      if (query.includedTags?.length === 0) {
        request = App.createRequest({
          url: `${MangaFreak_BASE}/Find/${query?.title?.replace(/%20/g, "+").replace(/ /g, "+") ?? ""}`,
          method: "GET"
        });
      } else {
        const GenreDeatils = [];
        const SelectedTags = [];
        const UnSelectedTags = [];
        const Status = [];
        const Types = [];
        query.includedTags?.map((x) => {
          const id = x.id;
          const SplittedID = id?.split(".")?.pop() ?? "";
          if (id.includes("details.")) {
            GenreDeatils.push(SplittedID);
          }
          if (query.includedTags?.length === 1 && id.includes("genre.")) {
            GenreDeatils.push(SplittedID);
          }
          if (id.includes("genre.")) {
            SelectedTags.push(SplittedID);
          }
          if (id.includes("status.")) {
            Status.push(SplittedID);
          }
          if (id.includes("types.")) {
            Types.push(SplittedID);
          }
        });
        query.excludedTags?.map((x) => {
          const id = x.id;
          const SplittedID = id?.split(".")?.pop() ?? "";
          if (id.includes("genre.")) {
            UnSelectedTags.push(SplittedID);
          }
        });
        if (GenreDeatils.length === 1) {
          request = App.createRequest({
            url: `${MangaFreak_BASE}/Genre/${GenreDeatils[0]}/${page}`,
            method: "GET"
          });
          UsesDeatils = true;
        } else {
          if (!query.title) {
            throw new Error("Do not use genre with multipule tags search without putting a title or the search will infinitely loop");
          }
          const genres = ["/Genre/"];
          for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const SplittedID = tag.id?.split(".")?.pop() ?? "";
            if (SelectedTags?.includes(SplittedID)) {
              genres.push("1");
            } else if (UnSelectedTags?.inc
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)