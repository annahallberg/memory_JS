/*
Anna Hallberg 
Memory 

Pseudokod: 
- 10st bildrutor 
- Användaren kickar på ett kort som vänds 
- Användaren klickar på ett kort till som vänds 
- De 2 rutorna jämförs 
- OM rutorna är ett par så lämnas dessa uppvända. 
- OM rutorna är olika så vänds de 2 rutorna tillbaka igen
- Användaren får fortsätta att spela tills att alla rutor är uppåtvända
- Antal gissningar som görs räknas och vid avslutat spel meddelas spelaren resultatet. 
- Spelet startas om. 


Bilderna som används i koden är hämtade från vecteezy.com samt unspashed.com och
får användas fritt.
*/

//Deklarerar variabler samt tomma arrayer och arrayen som innehåller bilderna som ska paras ihop
let par = 0;
let raknare = 0;
let korten = [];
let spelKort = [];
let antalVanda = [];
const bilder = [
   "hund.jpg",
   "sol.jpg",
   "solnedgang.jpg",
   "stjarna.jpg",
   "tass.jpg",
];

//Kopplar diven "spelplan" som spelet kommer ligga i
let spelplan = document.getElementById("spelplan");

//Funktion som skapar spelet via att den slumpar ut bildernas position och kopplar korten till en eventlistener
function skapaSpel() {
   //Jag dubblerar bilderna (så att de kan bilda par) och lägger dessa i arrayen blandaBilder
   const blandaBilder = bilder.concat(bilder);
   /*.sort-funktionen letar efter negativa tal, positiva tal och talet 0 och sorterar talet därefter, därför ligger -0.5
   i uträkningen så att vissa tal blir negativa och sorteringen sker efter detta och är slumpmässig. */
   blandaBilder.sort(() => Math.random() - 0.5);

   //En forEach loopar igenom korten och deras index-plats
   korten.forEach((kort, index) => {
      //Lägger till en eventlistener som lyssnar efter när spelaren klickar på kortet och kör funktionen vandKort
      kort.addEventListener("click", vandKort);
      //Varje bild i arrayen med dess index läggs till i dataset och lagras i HTML-koden (i elementen med klassnamnet bild)
      //Tack vare det kan jag hämta kortens olika värden på ett enklare sätt än att hårdkoda varje kort för att komma åt dom
      kort.dataset.bild = blandaBilder[index];
   });
}

//Funktionen vandKortsom vänder korten så att spelaren kan se bilderna
function vandKort() {
   //Kortens som vänds läggs in i en array som heter antalVanda - som bara kan innehålla 2 värden åt gången
   //Om arrayen antalVanda innehåller under 2 värden OCH kortet som är klickat på (this) INTE redan ligger i arrayen OCH this inte har klassnamnet vant körs if-blockets kod
   if (
      antalVanda.length < 2 &&
      !antalVanda.includes(this) &&
      !this.classList.contains("vant")
   ) {
      /* Det valda kortet hämtar nu sin memorybild som ska matchas.
      Den valda bilden med klassnamnet bild hämtar bildinformationen ur dataset där vi i förra funktionen lagrat alla bildernas namn och indexplatser.
      Bildens namn läggs i "sökvägen" som startar ur mappen images och bildar på så vis src-vägen.     
      */
      this.querySelector(".bild").src = "images/" + this.dataset.bild;
      //Kortet läggs sedan till i arrayen antalVanda för att hålla koll på hur många kort som vänts.
      antalVanda.push(this);

      //OM antalvända redan innehåller två värden (kort) så körs funktionen där de 2 jämförs efter 1 sek
      //setTimeout har jag använt för att spelaren ska hinna se bilderna innan de jämförs
      if (antalVanda.length === 2) {
         setTimeout(jamforKort, 1000);
      }
   }
}

//Funktionen jamfortKort jämför de två kort som spelaren klickat på för att se om de är ett par
function jamforKort() {
   //För varje gång 2 kort jämförs så läggs 1 till på räknaren (den räknar antal drag som redovisas i slutet)
   raknare++;
   //Tilldelar de 2 värdena (korten) i arrayen namnet kort1 och kort2 för att göra det enklare att jobba med dom (kalla på dom för att jämföra)
   //Detta kallas efter rådfrågning på handledning för "destructuring assignment"
   const [kort1, kort2] = antalVanda;
   //För att se så att kodraden ovan funkade använde jag console.log för att se vad de två namnen innehåller för värden(kort).
   console.log(kort1, kort2);

   //OM kort1s bildinformation(dataset) är densamma som kort2s dataset så är det ett par
   if (kort1.dataset.bild === kort2.dataset.bild) {
      //1 läggs till på par, denna räknare finns för att hålla koll på när spelaren matchat alla kort för att kunna avsluta spelet
      par++;
      //Jag lägger här till en klass på bilderna som är vända så att de ej ska gå att "vända" dessa igen, detta för att komma ifrån att spelet jämförde redan vända bilder
      kort1.classList.add("vant");
      kort2.classList.add("vant");

      //OM antal par är lika många som arrayen med bilderna i är lång så är spelet utklarat och spelaren meddelas detta samt antal gissningar
      if (par === bilder.length) {
         alert(
            "Grattis, du klarade spelet! Du gjorde " +
               raknare +
               "st drag för att klara spelet. " +
               "  Låt oss spela en omgång till!"
         );
         //Spelet startar sedan om
         restartMemory();
      }
   }
   //OM kortens dataset INTE stämmer tas klassen vant bort från dessa och korten vänds tillbaka (tilldelas bakgrundsbilden)
   else {
      kort1.classList.remove("vant");
      kort2.classList.remove("vant");

      kort1.querySelector(".bild").src = "images/kortbakgrund.jpg";
      kort2.querySelector(".bild").src = "images/kortbakgrund.jpg";
   }
   //antalVanda nollställs för att kunna användas igen vid nästa drag
   antalVanda = [];
}

//Funktion som startar om memoryt
function restartMemory() {
   //Återställer nedan variabler till 0 och tömmer arrayer så att spelet ska kunna köras igen
   antalVanda = [];
   raknare = 0;
   par = 0;

   //Loop som itererar igenom alla korten och tar bort klassnamnen vant och ändrar bilderna till bakgrundsbilden
   korten.forEach((kort) => {
      kort.classList.remove("vant");
      kort.querySelector(".bild").src = "images/kortbakgrund.jpg";
   });
   //Kör funktionen skapaSpel som startar ny spelomgång
   skapaSpel();
}

//Skapa bilderna som vi ser i spelet, då vi bara behöver 10st bilder ligger dessa ej i ngn funktion då jag inte vill att det ska skapas ytterligare 10 för varje spel
for (let i = 0; i < 10; i++) {
   //Skapar divar med klassnamnet kort inuti spelplanen som "barn" till spelplanen
   kort = document.createElement("div");
   kort.classList.add("kort");
   spelplan.appendChild(kort);

   //Pushar in korten jag skapar i en array så att forEach-looparna i funktionerna ska kunna gå igenom dessa
   korten.push(kort);

   //Skapar img-element med klassnamnen bild och tilldelar dessa en bild via src (kortens baksida)
   bild = document.createElement("img");
   bild.classList.add("bild");
   bild.src = "images/kortbakgrund.jpg";
   //Placerar bilderna i kort-divarna - dvs de är "barn" till kortdivarna
   //Jag valde att göra så för att enklare kunna styla spelplanen
   kort.appendChild(bild);
}

//Kallar på funktion som drar igång spelet
skapaSpel();
