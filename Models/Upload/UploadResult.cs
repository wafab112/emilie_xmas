namespace xmas.Models.Upload;

public class UploadResult
{
    public EntryFullDto? Entry { get; set; }
    public bool Succeeded { get; set; }

    static public UploadResult Failed = new ()
    {
        Succeeded = false
    };
}
