export class FullEntryDto
{
    day: number;
    date: number;

    title: string;
    innerHTML: string;

    image: string;
    thumbnail: string;
}

export class FullEntry
{
    day: number;
    date: Date;

    title: string;
    innerHTML: string;

    image: Blob;
    thumbnail: Blob;
}

export class ThumbEntryDto
{
    day: number;
    date: number;

    title: string;

    thumbnail:string;
}

export class ThumbEntry
{
    day: number;
    date: Date;

    title: string;

    thumbnail: Blob;
}
