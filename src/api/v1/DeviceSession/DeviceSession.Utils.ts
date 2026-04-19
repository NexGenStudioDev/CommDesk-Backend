import axios from "axios";
import { UAParser } from "ua-parser-js";
import crypto from "crypto";
import { cp } from "fs";

class DeviceSessionUtils {
  async getDeviceInfo(ip: string | undefined, userAgent: string, userId: string) {
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    console.log("UA Parser Result:", ua);

    // 1. Device Name Nikalna
    // Mobile par model mil jata hai (e.g. iPhone), Desktop par hum OS name use karte hain.
     const deviceName = ua.device.model 
  ? `${ua.device.vendor || ""} ${ua.device.model}` 
  : `${ua.os.name || "Unknown"} ${ua.cpu.architecture || "Desktop"}`;

    // 2. Unique Device ID Generate Karna
    // Hum UserAgent aur IP ko combine karke ek unique hash bana sakte hain
    const deviceId = crypto
      .createHash("md5")
      .update(userId + userAgent + (ua.os.name || ""))
      .digest("hex");

    // 3. Device Image Logic
    const deviceImage = this.getDeviceImage(ua.device.type, ua.os.name);

    // 4. IP-API call for Location
    let location: {
      country: string;
      region: string;
      city: string;
      zip?: string;
      lat?: string,
      lon: string,
      regionName?: string;
      isp: string;
    } = {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      zip: undefined,
      lat: undefined,
      lon: "Unknown",
      regionName: undefined,
      isp: "Unknown"
    };
    try {
      if (ip && ip !== "127.0.0.1") {
        const res = await axios.get(`http://ip-api.com/json/${ip}`);
        console.log("IP-API Response-->", res.data);
        if (res.data.status === "success") {
         location = {
            region: res.data.regionName,
            country: res.data.country,
            isp: res.data.isp,
            regionName: res.data.regionName,
            city: res.data.city,
            zip: res.data.zip,
            lat: res.data.lat,
            lon: res.data.lon,
         }
        }
      }
    } catch (e) {
      console.log("Location fetch failed");
    }

    return {
      userId,
      sessionId: crypto.randomBytes(16).toString("hex"),
      deviceId,
      deviceName,
      browser: `${ua.browser.name} ${ua.browser.major}`,
      cpu: ua.cpu.architecture || "unknown",
      os: `${ua.os.name} ${!ua.os.version ? "Unknown" : ua.os.version}`,
      ip: ip || "unknown",
      location,
      userAgent,
      deviceImage,
      isActive: true,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    };
  }

  private getDeviceImage(type: string | undefined, os: string | undefined) {
    if (type === "mobile") return "https://flaticon.com"; // Mobile Icon
    if (os === "Windows") return "https://flaticon.com"; // Windows Icon
    if (os === "Mac OS") return "https://flaticon.com"; // Apple Icon
    if (os === "Linux") return "https://flaticon.com"; // Linux Icon
    return "https://flaticon.com"; // Generic Laptop/Desktop Icon
  }
}

export default new DeviceSessionUtils();
