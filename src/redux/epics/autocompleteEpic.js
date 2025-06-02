import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { debounceTime, switchMap, map, catchError, filter } from 'rxjs/operators';
import {
  AUTOCOMPLETE_REQUEST,
  autocompleteSuccess,
  autocompleteFailure,
  addToHistory,
} from '../actions/autocompleteActions';

// Replace with your Google Places API key
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const GOOGLE_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const useMock = true; // Set to true to use mock data

const mockResults = [
  { description: 'Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia', place_id: 'ChIJ5-rvAcdJzDERfSgcL1uO2fQ', coordinates: { lat: 3.1390, lng: 101.6869 } },
  { description: 'Penang, Malaysia', place_id: 'ChIJf5XDJqVMzDERlYNg2EdXvRc', coordinates: { lat: 5.4141, lng: 100.3288 } },
  { description: 'Johor Bahru, Johor, Malaysia', place_id: 'ChIJf8RD7I-ZBTERmkMCBktIf9s', coordinates: { lat: 1.4927, lng: 103.7414 } },
  { description: 'Malacca City, Malacca, Malaysia', place_id: 'ChIJOWm0SXG2zTERcDnHHQDXwgs', coordinates: { lat: 2.1896, lng: 102.2501 } },
  { description: 'Kota Kinabalu, Sabah, Malaysia', place_id: 'ChIJq9qsyXhwOzIRgWM4UkxVVzU', coordinates: { lat: 5.9804, lng: 116.0735 } },
  { description: 'Ipoh, Perak, Malaysia', place_id: 'ChIJOZLT1_hKzDERHxjd3A-Asj8', coordinates: { lat: 4.5975, lng: 101.0901 } },
  { description: 'Kuching, Sarawak, Malaysia', place_id: 'ChIJf9nwj-ER0TERgW03do3VSFE', coordinates: { lat: 1.5497, lng: 110.3654 } },
  { description: 'Cameron Highlands, Pahang, Malaysia', place_id: 'ChIJP8X4xn4KzTERQJcSfKULQMU', coordinates: { lat: 4.4717, lng: 101.3969 } },
  { description: 'Langkawi, Kedah, Malaysia', place_id: 'ChIJcXQMQmiUSjARx8R0ZzQ5h3Y', coordinates: { lat: 6.3500, lng: 99.8000 } },
  { description: 'Putrajaya, Malaysia', place_id: 'ChIJf40ck-jLzDERF2STtUm5_o8', coordinates: { lat: 2.9264, lng: 101.6964 } },
  { description: 'Miri, Sarawak, Malaysia', place_id: 'ChIJv5LkpQlpbDERJCZ5alqRd_c', coordinates: { lat: 4.3995, lng: 113.9914 } },
  { description: 'George Town, Penang, Malaysia', place_id: 'ChIJb67tGUpUzDERflxQbJCHVqs', coordinates: { lat: 5.4145, lng: 100.3292 } },
  { description: 'Sandakan, Sabah, Malaysia', place_id: 'ChIJTVfCT4eBID4RmEK7tSZQUFI', coordinates: { lat: 5.8402, lng: 118.1179 } },
  { description: 'Petaling Jaya, Selangor, Malaysia', place_id: 'ChIJn9vr9DdLzDERQHR0w1I_WYQ', coordinates: { lat: 3.1073, lng: 101.6068 } },
  { description: 'Taman Negara, Pahang, Malaysia', place_id: 'ChIJTVHsYEBrzTERMMFnfEQ4EVs', coordinates: { lat: 4.3833, lng: 102.4000 } }
];

export const autocompleteEpic = (action$) =>
  action$.pipe(
    ofType(AUTOCOMPLETE_REQUEST),
    map(action => action.payload),
    filter(query => query && query.length > 1),
    debounceTime(400),
    switchMap((query) => {
      if (useMock) {
        return of(
          autocompleteSuccess(mockResults),
          addToHistory(query)
        );
      }
      const url = `${GOOGLE_AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
      return ajax.getJSON(url).pipe(
        map((response) => {
          if (response && response.predictions) {
            return autocompleteSuccess(response.predictions);
          }
          return autocompleteFailure('No results');
        }),
        catchError((error) => of(autocompleteFailure(error.message)))
      );
    })
  );