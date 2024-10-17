import { BASE_URL } from "@/constants/Api";
import { Scan } from "./types";

export default async function createScan(personUuid: string): Promise<Scan> {
  const scan_response = await fetch(`${BASE_URL}/scans/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      person_uuid: personUuid,
    }),
  });
  const scan_data = await scan_response.json();
  return scan_data;
}
