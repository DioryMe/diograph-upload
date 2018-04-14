import { DiographStore, Diory } from 'diograph-store'
import { EXIF } from 'exif-js'
import * as request from "superagent"

// Promise.all() requires this to work
declare var Promise: any;

export class Upload {

  // TODO: Replace hardcoded authentication token with the use of DiographAuthentication
  static getAuthToken() {
    return "df548369-d0a2-4ca5-b28a-dd4fb14c1f08"
  }

  static uploadFiles(event): any {
    var files = event.target.files
    // TODO: Support for multiple files => some kind of iterator
    // - files is not an Array but a "FileList" which doesn't have forEach() iterator...
    this.createDioryFromImageFile(files[0])
  }

  static async createDioryFromImageFile(file): Promise<Diory> {

    // 1. Background is the uploaded image's S3 url
    // Get uploadUrl from diory-server
    let background = await this.getUploadUrls().then((uploadUrls) => {
        // Upload the file to S3 via PUT request to uploadUrl
        return request.put(uploadUrls["upload-url"]).send(file).then((response) => {
          // Return S3 url
          return uploadUrls["public-url"]
        })
      })

    // 2. Date, latitude & longitude are extracted from EXIF
    let exif = await this.extractEXIFData(file)

    // 3. Diory attributes are composed to dioryData
    let dioryData = {
      name: file.name,
      type: "image",
      background: background,
      date: exif["date"],
      latitude: exif["latitude"],
      longitude: exif["longitude"]
    }

    // 4. Create diory and return it
    DiographStore.setAuthToken(this.getAuthToken());
    return DiographStore.createDiory(dioryData).then(diory => {
      return diory
    })
  }

  static async extractEXIFData(file) {
    let self = this
    return new Promise((resolve) => {
      let exif = {}
      EXIF.getData(file, function() {
        exif["date"] = EXIF.getTag(file, "DateTimeOriginal");
        exif["latitude"] = self.toGpsDecimal(EXIF.getTag(file, "GPSLatitude"));
        exif["longitude"] = self.toGpsDecimal(EXIF.getTag(file, "GPSLongitude"));
        resolve(exif)
      });
    })
  }

  static toGpsDecimal(number) {
    return number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
  };

  static getUploadUrls() {
    return this.getFromEndpoint("http://localhost:3000/v1/presigned-upload-url").then((response) => {
      return response.data
    })
  }

  private static getFromEndpoint(endpoint, query={}) {
    var promise = request
      .get(endpoint)
      .query(query)
      .set("Accept", "application/vnd.api+json")
      .set("Authorization", this.getAuthToken())

    return promise.then(res => {
      return res.body
    }, err => { throw err })
  }

}
