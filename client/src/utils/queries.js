import { gql } from "@apollo/client";


export const ACTIVITY_CITY = gql`
  query activitiesByActivityCity($activity: String!, $city: String!) { 
    activitiesByActivityCity(activity: $activity, city: $city) {
      _id
      name
      location
      city
      lng
      lat
      description
      participants {
        _id
        username
        email
        shortBio
      }
    }
  }
`;
