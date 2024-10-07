/* eslint-disable prettier/prettier */
export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string | null;
  phone: string;
  email?: string | null;
}

export class CreateContactRequest {
  first_name: string;
  last_name?: string | null;
  phone: string;
  email?: string | null;
}

export class UpdateContactRequest {
  id: number;
  first_name: string;
  last_name?: string | null;
  phone: string;
  email?: string | null;
}

export class SearchContactRequest {
  name?: string;
  phone?: string;
  email?: string;
  page: number;
  size: number;
}
