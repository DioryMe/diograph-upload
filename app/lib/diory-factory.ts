import { DiographStore, Diory } from 'diograph-store'
import { EXIF } from 'exif-js'
import * as request from "superagent"

// new Promise() requires this to work
declare var Promise: any;

export class DioryFactory {

  static createDioryFromFile(file, token): any {
    DiographStore.setAuthToken(token);

    // TODO: Support for multiple files => some kind of iterator
    // - files is not an Array but a "FileList" which doesn't have forEach() iterator...
    let dioryData = this.generateDioryDataFromImageFile(file, token)
    return DiographStore.createDiory(dioryData).then(diory => {
      // return diory
      return "jeejee"
    })
  }


// ------- PRIVATE METHODS --------


// Generate diory data by getting the background and extracting the EXIF data
  static async generateDioryDataFromImageFile(file, token): Promise<object> {

    // 1. Background is the uploaded image's S3 url
    let background = await this.getBackground(file, token)

    // 2. Date, latitude & longitude are extracted from EXIF
    // TODO: Skip this if no EXIF data available => return empty object {}
    let exif = await this.extractEXIFData(file)

    // 3. Diory attributes are composed to dioryData
    return {
      name: file.name,
      type: "image",
      background: background,
      date: exif["date"],
      latitude: exif["latitude"],
      longitude: exif["longitude"]
    }
  }


// Upload to S3 and get its public url as background for the created diory

  static async getBackground(file, token) {
    // Get uploadUrl from diory-server
    let uploadUrl = await this.getUploadUrl(token)

    // Try to upload file to S3
    let S3Response
    await this.S3ManagerUpload(uploadUrl["upload-url"], file)
      .then(response => {
        S3Response = response
      })

    // Return file's public url on success
    if (S3Response.ok) {
      return uploadUrl["public-url"]
    } else {
      return "new Error(" + S3Response.body + ")"
    }
  }

  static getUploadUrl(token) {
    // TODO: Use some similar generic DiographStore / DiographServerManager method instead of duplicating it here
    return this.getFromEndpoint("http://localhost:3000/v1/presigned-upload-url", token).then(response => {
      return response.data
    })
  }

  static async S3ManagerUpload(uploadUrl, file) {
    // Upload the file to S3 via PUT request to uploadUrl
    return request
      .put(uploadUrl)
      .send(file)
      .then(response => {
        return response
      })
  }


  // TODO: Use some similar generic DiographStore / DiographServerManager method instead of duplicating it here
  private static getFromEndpoint(endpoint, token) { // query={}) {
    var promise = request
      .get(endpoint)
      // .query(query)
      .set("Accept", "application/vnd.api+json")
      .set("Authorization", token)

    return promise.then(res => {
      return res.body
    }, err => { throw err })
  }


// EXIF stuff

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

}
