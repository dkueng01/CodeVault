---
author: David Küng
pubDatetime: 2025-03-20T15:00:00Z
title: Angular Architecture Workshop – Dokumentation
slug: angular-architect-workshop
featured: true
draft: false
tags:
  - Angular
  - Documentation
  - Architect
description: Dokumentation vom Angular Architecture Workshop
---

# 🏗️ Angular Architecture Workshop – Übersicht
## 👨‍🏫 Workshop-Leitung
Die zwei Experten von diesem Angular Workshop waren:
- Manfred Steyer
    - Google Developer Expert für Angular
    - Gründer von ANGULARarchitects.io
    - Autor, Speaker und Berater
- Assaad Awada
    - Auch Angular-Profi mit Fokus auf Enterprise-Lösungen

## 🎯 Ziel des Workshops
Der Workshop war für Entwickler die schon ein wenig mit Angular vertraut sind, man musste jedoch noch kein profi sein. Es ging grundsätzlich darum, wie man **Enterprise-Apps** aufbaut und strukturiert. Damit diese dann gut skalierbar und performant sind.
Ziel war es:
- Architekturkonzepte zu lernen
- Diese Konzepte dann immer mit einer kleinen Demo vorprogrammiert zu bekommen und dann auch selber "sich die Hände dreckig machen" und eine kleine Übung zu programieren

## 🧩 Inhalte des Workshops
Der Workshop war in zwei Teile aufgeteilt:
- **Architektur & Struktur**
    - Monorepos & Libraries: *Code-Strukturierung mit Nx*
    - Strategic Design (DDD): *Domain-getriebene Architektur*
    - Nx & Incremental Compilation: *Effizientes Build-System*
    - Micro Frontends: *Aufteilung großer Frontends*
- **Moderne Angular-Techniken**
    - Signals & Signal Store: *Neue reaktive Konzepte*
    - NGRX mit Signals: *Moderne State-Management-Ansätze*
    - Performance-Tuning
    - Authentication: *Authentifizierungsstrategien*

## 💻 Voraussetzungen & Setup
Setup um am Workshop mitzumachen:
- NodeJS (LTS-Version)
- Visual Studio Code oder WebStorm
- Angular CLI und Nx CLI
- Git (Command Line Client)

## 🔗 Links / Quellen
- Workshop-Seite: https://workshops.angulararchitects.io/ms/f5703891-0885-48a2-995c-c7f61dd51aef/

# 🏗️ Angular Architektur: Monorepos, Nx & Micro Frontends
## 🔑 Grundidee
- **Monorepo:** Ein großes Softwarelösung die aus einem Git-Repo besteht in der alle Features, Libs usw vorhanden sind
- **Nx:** Eine Tool um mit Befehlen oder UI ein Monorepo zu erstellen und zu pflegen. Ist aber nicht nur ein Generator sondern übernimmt andere Dinge wie Caching, Testing und Builden (Cloud & Lokal)
- **Domain Driven Design:** Ist ein Design-Pattern das eine Applikation in zusammen passende Teile aufteilt
- **Micro Frontends**: Ein großes Frontend in kleine unabhängige teile aufteilen und diese dann in eine Website "laden"

## 🚀 Vorteile von Monorepos mit Nx
- Alle arbeiten mit der selben Version
    - Es müssen nicht verschiedene "shared Features" auf NPM geladen und versioniert werden, da alle immer mehr oder weniger auf der gleichen Version arbeiten (ausgenommen zum Beispiel Merge Conflicts).
    - Dadurch fällt es viel schneller auf wenn eine Feature-Implementierung ein anderes Feature kaputt macht (vor allem wenn man gute Tests hat)
- Durch Nx sind die "builds" der Applikation schneller, auch wegen dem intelligenten Caching
    - Man kann lokal aber auch in der Cloud oder in einer Pipeline sehr einfach und effektiv "builds" erstellen
- Gute Trennung durch "Fences"
    - man verteilt Tags in jedem `project.json` und kann dann im `.eslintrc.json` regeln erstellen, welche Teile deiner App mit wem reden dürfen und mit wem nicht
    - Kann so aussehen:
        - `"tags": ["domain:luggage", "type:app"]`
        - `"tags": ["domain:luggage", "type:feature"]`
        - `"tags": ["domain:luggage", "type:domain-logic"]`
        - `{"sourceTag": "domain:luggage", "onlyDependOnLibsWithTags": ["domain:luggage", "domain:shared"]}`

## 🧭 Domain-Driven Design (Strategic Design)
- Eine App wird in verschiedene "Domains" aufgeteilt
    - In unserem FlightApp Beispiel z.B. "Booking", "Check-In", "Luggage", ...
- Jede Domain hat eigene Schichten
    - z.B. UI-, Domain-, API-Layer
- Vorteile: Klare Grenzen, bessere Wartbarkeit, weniger Verknüpfungen

## 🧰 Nx Basics – Quick Start
```bash
# Neues Projekt mit Nx starten
npx create-nx-workspace@latest my-project

# Neue App / Library erzeugen
nx generate app booking-app
nx generate lib booking-ui

# App starten
nx serve booking-app

# Architektur-Graph anzeigen
nx graph
```

## 🧩 Micro Frontends
**Wann sind Micro Frontends von Vorteil?**
- Wenn man ein großes Team ist, kann man sich in viele kleine unabhängige Teams aufteilen, die sogar recht einfach auf der ganzen Welt verteilt daran arbeiten können
- Grundsätzlich Technologievielfalt
    - Es ist jetzt nicht so, dass man zwingen immer neue Technologien verwenden sollte. Klar sollte man sich normal auf ein System eignen und nicht mit Absicht React, Angular und Vue zum Beispiel mischen. Jedoch ist es Grundsätzlich möglich da es im Endeffekt alles HTML, CSS und JS ist. Manchmal kann es praktisch sein verschiedene Technologien verwenden zu können um die jeweiligen Vorteile auszunützen

**Was gibt es für Varianten?**
- Monorepo mit mehreren Apps
- Mehrere Repos (gemeinse Libs über npm geteilt)

## 🔄 Build & Caching mit Nx
- Lokaler Cache: Schnelle Wiederholungen
- Nx Cloud: Parallele Builds in CI/CD
    - `nx connect-to-nx-cloud`
- Nur betroffene Projekte bauen
    - `nx affected --target=build --base=main`

## 📦 Web Components für Micro Frontends
Man kann Angular-Components als Web-Components bauen:
```ts
// bootstrap.ts
const app = await createApplication({ });
const cmp = createCustomElement(AppComponent, { injector: app.injector });
customElements.define('booking-root', cmp);
```
Diese können dann in anderen Frameworks verwendet werden!

## 📝 Kurz merken
|Konzept           |Zweck                             |
|------------------|----------------------------------|
|Monorepo          |Alles in einem Repo               |
|Nx                |Tooling & Struktur                |
|DDD               |Aufteilen nach Business-Logik     |
|Micro Frontends   |Skalierung für große Teams        |
|Web Components    |Technik-übergreifende Integration |

# ⚡️ Signals in Angular – Reaktive Architektur
## 🔍 Was sind Signals?
**Signals** sind eine Art in Angular mit **reaktiven Daten** umzugehen. Ähnlich wie Observables nur viel einfacher! (*Meiner Meinung nach sehr ähnlich wie State Management in React, was grundsätzlich für mich viel mehr Sinn macht als Observables als React Dev*)

Wie lauft das ab?
- Man kann sich das mit einer Variable vorstellen, die sich automatisch neu rendert/berechnet wenn eine Abhängigkeit der Variable sich ändert
- Dadurch macht es die Change-Detection genauer und ermöglicht sogar ein **zone-less Modus**
    - **zone-less Modus**: Der zonenlose Modus in Angular ist eine neue Änderungserkennungsmethode, die die Abhängigkeit von Zone.js vermeidet. Dadurch wird die Leistung verbessert und der Speicherverbrauch reduziert

## 🧱 Grundbausteine
**Signal (State)**
```ts
const counter = signal(0);
counter.set(counter() + 1); // Zugriff mit (), Änderung mit .set()
```
**Computed (abgeleitet)**
```ts
const double = computed(() => counter() * 2);
```
**Resource (async mit Auto-Update)**
```ts
const flights = resource({
  request: searchParams,
  loader: (params) => flightService.find(params)
});
```
**Effect (Nebenwirkungen)**
```ts
effect(() => {
  console.log('Counter ist jetzt:', counter());
});
```
⚠️ Effekte sollten nur Dinge wie Logging, DOM oder lokale Speicherung machen – **keine Business-Logik**!

#### 🧪 Beispiel: Signal in einem Component
```ts
flights = signal<Flight[]>([]);

const data = await this.flightService.find('Graz', 'Vienna');
this.flights.set(data);

<!-- Im Template -->
<div *ngFor="let f of flights()">
  <flight-card [item]="f"></flight-card>
</div>
```

#### 🔁 Integration mit RxJS
```ts
// Observable → Signal
const counterSignal = toSignal(myObservable$);

// Signal → Observable
const myObservable$ = toObservable(counterSignal);
```

## 🧠 Architektur-Regeln
|Regel |Bedeutung                                                  |
|------|-----------------------------------------------------------|
|#1	   |Zustand lieber ableiten als speichern (computed, resource) |
|#2	   |Keine Business-Logik in effect()                           |
|#3	   |Nutze reactive helpers wie resource() oder @ngrx/signals   |

## 📝 Kurz merken
|Konzept |Beschreibung |
|------|------|
|`signal()` |Reaktiver Zustand (state) |
|`computed()` |Abhängiger Wert, wird neu berechnet |
|`resource()` |Async mit Loading + Caching |
|`effect()` | Reaktion auf Änderungen (z. B. Logging, Rendering) |
|`toSignal()`/`toObservable()` |Verbindung zu RxJS |

# 🏪 NGRX Signal Store – State Management mit Signals
## 🧠 Warum ein Signal-Store?
Mit einem Store kann man States zentral verwalten. Es kann Dinge übersichtlicher machen und gewisse "reaktive Datenflüsse" einfacher zum steuern machen.

## 🚦 Aufbau eines Signal Stores
```ts
export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Paris',
    to: 'London',
  }),
  withComputed((state) => ({
    route: computed(() => `${state.from()} → ${state.to()}`)
  })),
  withMethods((state) => ({
    updateFrom: (value: string) => state.from.set(value),
  })),
);
```
🧩 **Bausteine:**
- `withState()` – hier liegt der Datenzustand
- `withComputed()` – ViewModel-Daten, automatisch abgeleitet
- `withMethods()` – Methoden, um den State zu ändern

## 🏗️ Architektur-Tipps
- Jeder Feature-Bereich bekommt einen eigenen Store
- Kein "tiefer" verschachtelter Zustand – lieber flach & normalisiert
- Smart- vs. Dumb-Components: Trennung von Logik & Darstellung
- Einfache, einseitige Datenflüsse (von Komponente → Store → View)

## 📝 Kurz merken
|Funktion |Zweck |
|---------|------|
|`signalStore()` |Basis für Store |
|`withState()` |Zustand definieren |
|`withComputed()` |Ableitungen berechnen |
|`withMethods()` |Methoden zum Setzen |
|`withEntities()` |Listen verwalten (CRUD) |
|`rxMethod()` |Async Logik mit RxJS |
|`withCallState()` |Lade-Status etc. |
|`withUndoRedo()` |Undo/Redo Funktion |
|`withDevtools()` |Integration Redux DevTools |

# 📦 NGRX (Redux) – State Management in Angular
## 🧠 Warum NGRX?
- Ist gut für **komplexe Anwendungen** mit vielen UI-Zuständen (States)
- Man kann gut den Zustand, UI und Logik trennen
- Vorhersehbares Verhalten durch Redux-Prinzip:
    - Single Source of Truth
    - Unveränderlicher Zustand
    - Datenfluss ist einseitig (uni-directional)

## 🔁 Die Grundidee (Redux Pattern)
```txt
UI → dispatch(Action) → Reducer → State → View
```

Bestandteile:
- State: der aktuelle Datenzustand
- Action: beschreibt was passiert
- Reducer: wandelt alte in neue State-Version um
- Selector: liest bestimmte Daten aus dem State
- Effect: für async Logik (z. B. HTTP-Requests)

## 🧱 Beispiel: Tickets Store
**1. State**
```ts
export interface TicketsState {
  flights: Flight[];
}
```
**2. Actions**
```ts
export const ticketsActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights loaded': props<{ flights: Flight[] }>(),
    'update flight': props<{ flight: Flight }>(),
  },
});
```
**3. Reducer**
```ts
export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialState,
    on(ticketsActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    }))
  )
});
```

**🔍 Selector**
```ts
export const selectFilteredFlights = createSelector(
  ticketsFeature.selectFlights,
  ticketsFeature.selectHide,
  (flights, hide) => flights.filter(f => !hide.includes(f.id))
);
```
Verwendung:
```ts
this.store.select(selectFilteredFlights);
```

**🌐 Async Logik mit Effects**
```ts
@Injectable({ providedIn: 'root' })
export class TicketsEffects {
  flightService = inject(FlightService);
  actions$ = inject(Actions);

  loadFlights = createEffect(() =>
    this.actions$.pipe(
      ofType(ticketsActions.loadFlights),
      switchMap(a => this.flightService.find(a.from, a.to)),
      map(flights => ticketsActions.flightsLoaded({ flights }))
    )
  );
}
```
Bereitstellen (root oder Feature):
```ts
provideEffects(TicketsEffects)
```

## 🧠 Architektur-Tipps
|Prinzip |Erklärung |
|--------|----------|
|Einseitiger Datenfluss |UI → Action → State → View |
|Trennung von Logik & UI |Smart vs. Dumb Components |
|Selectors |Holen genau die Daten, die du brauchst |
|Effects |Nur für Nebenwirkungen (z. B. HTTP) |

## 📝 Kurz merken
|Teil |Aufgabe |
|-----|--------|
|Action |Was soll passieren? |
|Reducer |Wie reagiert der State? |
|Selector |Welche Daten brauchen wir? |
|Effect |Async-Logik (HTTP, etc.) |
|Store |Zugriffspunkt für alles |

# ⚡️ Performance in Angular
## 🚀 Wichtige Konzepte
|Konzept |Worum geht’s? |
|--------|--------------|
|Lazy Loading |Module nur laden, wenn sie wirklich gebraucht werden |
|Preloading |Module im Hintergrund schon mal laden, bevor sie gebraucht werden |
|OnPush |Angular rendert nur, wenn es wirklich nötig ist |

## 💤 Lazy Loading
Anstatt beim ersten Laden der Website alles zu laden, werden nur diese Componenten geladen die gerade gebraucht werden.
```ts
const APP_ROUTE_CONFIG: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'flights',
    loadChildren: () =>
      import('./flight-booking/flight-booking.routes'),
  }
];
```
Vorteil dabei ist eigentlich hauptsächlich, dass die Website schnell erreichbar ist und die Grundlegenden Dinge angezeigt werden.

🤔 **Wann sinnvoll?**
- Bei großen Apps mit vielen Routen
- Wenn ein Feature nicht beim App-Start benötigt wird
- Für selten genutzte Bereiche (z. B. Admin-Bereich)

🛠️ **Best Practices:**
- Pro größerem Feature ein eigenes Modul
- Verwende `loadChildren()` für Lazy-Loading von Routen
- Achte auf korrekte Routing-Konfiguration – sonst wird ein Modul evtl. doch direkt geladen

## 🚚 Preloading
Hier werden bestimmte Teile der Website nach dem initialen Laden im Hintergrund geladen, damit wenn navigiert wird die wichtigen Dinge schon da sind.
```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules))
  ]
});
```

🤔 **Wann sinnvoll?**
- Wenn Module zwar nicht sofort, aber wahrscheinlich bald gebraucht werden
- Bei guter Netzwerkverbindung / Performance
- Wenn UX wichtig ist (→ keine Ladezeit beim Routing)

🛠️ **Best Practices:**
- Nutze `withPreloading(PreloadAllModules)` oder eine eigene Strategie
- Mit einer Custom Preloading Strategy kannst du:
- Nur bestimmte Routen vorladen (`data: { preload: true }`)
- Nach Bedingungen laden (z. B. wenn Akku gut oder WLAN vorhanden)

## 🤝 Kombination: Lazy Loading + Preloading
Oft ist die beste Lösung ein Mix aus beiden Welten, bei Lazy Loading und Preloading ist das auch so. Man sollte am besten immer:
- Wie groß ist welches Feature der Website?
- Wie oft wird das Feature verwendet?
- Ist das Feature direkt verwendbar?

Am besten verwendet man Lazy Loading für alle Features und Preloading für die wichtigen davon!

```ts
{
  path: 'flights',
  loadChildren: () => import('./flight/flight.routes'),
  data: { preload: true }
}
```
Mit einer passenden Preloading-Strategie kannst du dann nur Routen mit preload: true laden.

🧠 **Entscheidungshilfe**
|Situation |Empfehlung |
|----------|-----------|
|Große App mit vielen Routen |Lazy Loading |
|Wichtige Routen bald nach Start benötigt |Preloading |
|Kleinere App, keine Performance-Probleme |Einfach alles direkt laden |
|Kombination aus wichtig + selten |Lazy + selektives Preloading |

## 🧠 OnPush
Ist eine Change-Detection bei der Angular nur die Components updated die sich auch wirklich geändert haben.
```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightCardComponent {
  @Input() flight;
}
```
Dadurch hat man weniger Rechenleistung und die Components sind meistens schneller.

## 📝 Kurz merken
|Technik |Nutzen |
|--------|-------|
|Lazy Loading |Nur laden, was wirklich gebraucht wird |
|Preloading |Vorladen im Hintergrund |
|OnPush |Weniger unnötige Updates |

# 🔐 Moderne Auth im Web
## 🧩 Grundkonzepte
Zwei gute/wichtige Standards wenn es ums Thema Auth geht sind **OAuth 2** und **OpenID Connect**.

Beteiligte Rollen:
- Client = deine Angular App
- Authorization Server = gibt Tokens aus (z. B. Auth0, Keycloak)
- Resource Server = deine API

## 🔄 Der "Code Flow" (empfohlen)
- Früher: „Implicit Flow“ → heute nicht mehr empfohlen!
- Besser: Code Flow + PKCE
    - Sichere Methode mit Zwischenschritt und Code-Verifikation

Ablauf:
- User wird zum Login umgeleitet
- Login liefert Code zurück an Client
- Client tauscht Code gegen Access-Token & ID-Token
- (Optional) Refresh Token wird mitgegeben

**PKCE steht für:** Proof Key for Code Exchange
Es ist eine Erweiterung für den klassischen OAuth2 Code Flow, speziell für Single Page Applications (SPAs).

🔐**So funktioniert PKCE:**
- Der Client (Browser) erzeugt einen zufälligen Code-Verifier
- Daraus wird ein Code-Challenge berechnet (meist per SHA256)
- Der Client schickt den Code-Challenge beim Login mit
- Der Authorization Server speichert diesen Challenge
- Nach erfolgreichem Login sendet der Server einen Code zurück
- Der Client tauscht diesen Code zusammen mit dem ursprünglichen Code-Verifier gegen ein Token
- Der Server prüft: „Stimmt der Code-Verifier zum Challenge?“

**Vorteil von PKCE:**
Selbst wenn jemand den "Code" abfängt → kann er damit nichts anfangen, weil er den Verifier nicht kennt.

## 🔄 Token Refresh – ohne erneutes Login
Warum?
- Tokens laufen oft nach kurzer Zeit ab (z. B. 5–15 Min)
- Nutzer sollen nicht ständig neu einloggen

Lösung:
- Refresh Token anfordern & nutzen

**⚠️ ACHTUNG**
Der Refresh Token gibt dir dauerhaften Zugriff auf neue Access Tokens – ohne erneutes Login.

Laut früheren OAuth2-Standards sollten SPAs niemals Refresh Tokens verwenden, weil:
- SPAs nicht vertrauenswürdig sind (kein sicheres Speichern möglich)
- XSS-Angriffe könnten die Tokens klauen

(Stell dir vor, dein Browser speichert ein Master-Passwort ohne Tresor. Genau das passiert mit Refresh Tokens im JS-Kontext)

✅ **Ausnahme (neuere Best Practices):**
Mit besonderen Schutzmaßnahmen wie:
- HttpOnly Cookies (nicht über JS zugänglich)
- SameSite + Secure
- Verwendung mit einem Backend for Frontend (BFF)

## 🛡️ Auth Gateway (Backend for Frontend)
Tokens nicht im Browser, sondern auf dem Server speichern. (Weil der Browser viel zu unsicher ist!)

Ablauf:
- User authentifiziert sich über Gateway (z. B. YARP Proxy)
- Tokens werden nur auf dem Server gehalten
- Frontend bekommt Cookies (HTTP-only, Secure)
- APIs laufen über das Gateway → keine Token-Weitergabe im JS

✅ Vorteile:
- Kein direkter Zugriff auf Token im Browser (XSS-Schutz)
- Refresh sicher & zentral
- Bessere Integration in Infrastruktur (z. B. mit Azure, Kong, Traefik)

#### 🗝️ Zugriff auf mehrere Resource-Server – Token Trennung
**Szenario:** Du hast mehrere APIs (Microservices)
- Resource Server 1 = Kundendaten
- Resource Server 2 = Rechnungen
- Authorization Server = Key Management

**Ablauf:**
- Der BFF (oder Client) bekommt einen Zentralen Access Token für den Authorization Server
- Beim Zugriff auf z. B. Resource Server 1:
    - Der Client fordert beim Auth-Server einen spezifischen Token für Server 1 an
- Beim Zugriff auf Server 2:
    - Neuer Request → Neuer Token nur für diesen Server

**Warum so?**
Es ist besser einen Schlüssel für ein Schloss zu verlieren, als einen Schlüssel zu verlieren der jedes Schloss öffnet. (Wenn ein Token für nur einen Server kompromittiert wird, bleibt der Rest geschützt)

## 💥 Warum ist der Browser unsicher?
**Gründe:**
- JavaScript kann von überall ausgeführt werden (XSS)
- localStorage & sessionStorage sind vollständig durch JS zugänglich
- Keine echte Trennung zwischen App-Code und fremdem Code (z. B. Werbung, Extensions)
- Tokens können mit fetch()-Proxies abgegriffen werden
- Kein kontrollierter Speicher wie bei nativen Apps

Die Diskussion „Token in Variable oder localStorage“ ist also nicht die wichtigste Frage, da Browser generell kein sicherer Ort für Tokens ist.

## 🧪 Best Practices für Auth
|Thema |Empfehlung |
|------|-----------|
|Flow |Immer Code Flow + PKCE |
|Token Handling |Wenn möglich: Server-seitig (BFF) |
|Token Refresh |Nur bei Bedarf, mit Sicherheitschecks |
|Token Storage |Nicht im localStorage, lieber Cookies |
|Sicherheit |Nutze SameSite, HttpOnly, Secure Cookies |

## 📝 Kurz merken
|Konzept |Zweck |
|--------|------|
|Code Flow + PKCE |Sichere Authentifizierung für SPAs |
|ID Token |Infos über den Benutzer |
|Access Token |Zugriff auf geschützte APIs |
|Refresh Token |Verlängert Sitzung ohne Login |
|Auth Gateway |Höchste Sicherheit, Tokens bleiben auf Server |