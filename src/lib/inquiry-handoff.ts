import { contacts } from "../config/site.ts";
import type { PreparedInquiry } from "../types/inquiry.ts";
/** Future storage can be awaited here before exposing messenger actions. */
export async function prepareInquiryHandoff(
  inquiry: PreparedInquiry,
  save?: (data: PreparedInquiry) => Promise<string>,
) {
  const prepared = save ? { ...inquiry, leadId: await save(inquiry) } : inquiry;
  return { inquiry: prepared, messengers: contacts.messengers };
}
