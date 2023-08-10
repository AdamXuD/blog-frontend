export interface ArticleBrief {
  uuid: string;
  title: string;
  created_time: number;
}

export interface Article extends ArticleBrief {
  content: string;
  updated_time: number;
}

export interface Site {
  title: string;
  description: string;
  github: string;
  email: string;
  footer: string;
}

export interface Metadata {
  site: Site;
  articles: ArticleBrief[];
}

export interface Attachment {
  filename: string;
  article_uuid: string;
  size: number;
  uploaded_time: number;
}
