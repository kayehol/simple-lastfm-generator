export type TagsQuery = {
    toptags: {
        tag: Tag[];
        "@attr": {};
    }
}[];

export type Tag = {
    count: number;
    name: string;
    url: string;
}