/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditHouseQuery
// ====================================================

export interface EditHouseQuery_house {
  __typename: "House";
  id: string;
  userId: string;
  address: string;
  image: string;
  latitude: number;
  longitude: number;
  publicId: string;
  bedrooms: number;
}

export interface EditHouseQuery {
  house: EditHouseQuery_house | null;
}

export interface EditHouseQueryVariables {
  id: string;
}
