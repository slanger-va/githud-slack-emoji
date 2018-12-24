import {HttpClient} from "@angular/common/http";
import {map, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

export interface EmojieMap {
  [shortnames: string]: string;
}

@Injectable()
export class AppService {
  customEmojies: Observable<EmojieMap>;
  slackEmojies: Observable<EmojieMap>;
  constructor(private http: HttpClient) {
    this.customEmojies = this.getCustomeEmojies();
    this.slackEmojies = this.getSlackEmojis();
  }

  getCustomeEmojies(): Observable<EmojieMap> {
    return this.http.get('./assets/emoji.json').pipe(map(
      ((result: any) => {
        if (result) {
          const emojiMap: {[key: string]: string} = {};
          result.map(r => {
            for(let i = 0; i < r['short_names'].length; i++) {
              emojiMap[r['short_names'][i]] = r['unified'];
            }
          });
          return emojiMap;
        }
      })),
      shareReplay(1));
  }


  getSlackEmojis(): Observable<EmojieMap> {
    const slackToken = sessionStorage.getItem('slackToken');
    return this.http.get('https://slack.com/api/emoji.list?token='+ slackToken).pipe(map(
    ((result: any) => {
      if (result) {
        const emoji = result.emoji;
        const paesMap: {[key: string]: string} = {};
        for(let key in emoji) {
          if (key.includes('alias:')) {
            key = key.replace('alias:', '');
          }
          paesMap[key] = emoji[key]
        }
        return paesMap;
      } else {
        return null;
      }
    })),
      shareReplay(1));
  }
}
