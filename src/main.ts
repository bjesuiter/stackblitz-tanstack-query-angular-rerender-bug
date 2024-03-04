import { HttpClient, provideHttpClient, withFetch } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  injectQuery,
  provideAngularQuery,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";
import "zone.js";
import { AngularQueryDevtools } from "@tanstack/angular-query-devtools-experimental";
import { CommonModule } from "@angular/common";

type WorldTimeApiResponse = {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: string | null;
  dst_offset: number | null;
  dst_until: string | null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, AngularQueryDevtools],
  template: `
  <fieldset>
    <legend>
      worldTimeApiQuery (with &#64;tanstack/angular-query-experimental)
    </legend>

    <p>Data status: {{ worldTimeApiQuery.status() }}</p>
    <p>Fetch status: {{ worldTimeApiQuery.fetchStatus() }}</p>

    @if (worldTimeApiQuery.isPending()) {
      Loading...
    }
    @if (worldTimeApiQuery.error()) {
      An error has occurred: {{ worldTimeApiQuery.error() | json }}
    }
    @if (worldTimeApiQuery.data(); as data) {
      <p>{{ data.datetime }}</p>
    }
  </fieldset>
  <angular-query-devtools initialIsOpen />
  `,
})
export class App {
  http = inject(HttpClient);
  name = "Angular";

  worldTimeApiQuery = injectQuery(() => ({
    queryKey: ["worldTimeApi"],
    queryFn: () =>
      lastValueFrom(
        this.http.get<WorldTimeApiResponse>(
          "http://worldtimeapi.org/api/timezone/Europe/Berlin",
        ),
      ),
  }));
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    // provideHttpClient(withFetch()),
    provideAngularQuery(new QueryClient()),
  ],
});
