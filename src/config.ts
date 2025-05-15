export const SITE = {
  website: "https://TODO.dev/", // replace this with your deployed domain
  author: "David Küng",
  profile: "https://bento.me/davidkueng",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "CodeVault",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "Europe/Berlin",
} as const;
