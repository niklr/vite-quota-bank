export interface IFileUtil {
  readFileAsync(path: string): Promise<any>
}

export class fileUtil implements IFileUtil {
  private static instance: fileUtil
  private _fileUtil: IFileUtil

  private constructor() {
    this._fileUtil = new browserFileUtil()
  }

  static getInstance(): fileUtil {
    if (!fileUtil.instance) {
      fileUtil.instance = new fileUtil()
    }

    return fileUtil.instance
  }

  readFileAsync(path: string): Promise<any> {
    return this._fileUtil.readFileAsync(path)
  }
}

export class browserFileUtil {
  async readFileAsync(path: string): Promise<any> {
    const response = await fetch(path);
    return response.text();
  }
}