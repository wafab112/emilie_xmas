class FullEntryDto
{
    day: number;
    date: number;

    title: string;
    innerHTML: string;

    image: string;
    thumbnail: string;
}

class FullEntry
{
    day: number;
    date: Date;

    title: string;
    innerHTML: string;

    image: Blob;
    thumbnail: Blob;
}

class ThumbEntryDto
{
    day: number;
    date: number;

    title: string;

    thumbnail:string;
}

class ThumbEntry
{
    day: number;
    date: Date;

    title: string;

    thumbnail: Blob;
}
