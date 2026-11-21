export type IdentityRecord = {
  id: string;
  khmer: string;
  latin: string;
  dob: string;
  gender: "Male" | "Female";
  phone: string;
  province: string;
  docId: string;
  docType: string;
  status: "Verified" | "Review" | "Incomplete";
  source: string;
  createdAt: string;
  accuracy: number;
};
