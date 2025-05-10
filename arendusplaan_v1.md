Eesti kinnisvaraportaal – detailne MVP projektiplaan
1. Projekti kirjeldus ja eesmärk
Projekti eesmärk on luua andmepõhine kinnisvaraplatvorm, mis keskendub elukondliku kinnisvara
hinnastatistikale Eestis. Portaal võimaldab kasutajatel (koduotsijad, maaklerid, arendajad) vaadelda
piirkondade kaupa mediaanhinda €/m², tehinguarvu ja hoonestusinfot. Erinevalt olemasolevatest
portaalidest keskendutakse statistilisele ja ajaloolisele vaatele, mitte aktiivsetele kuulutustele.
2. Portaalis teostatavad tegevused (funktsionaalsus)
- Valida piirkond kaardilt või otsinguga (maakond ® omavalitsus ® asula / linnaosa)
- Vaadata piirkonna kohta:
• Mediaanhind €/m² viimase kvartali/läbi aastate
• Tehingute arv ajas (graafik)
• Korterite vs majade hinnad ja dünaamika
- Statistiline profiil hoonestuse kohta:
• Keskmine ehitusaasta, korruste arv, energiamärgised
• Elamutüübid (elamumaa, korterelamu, suvilad jm)
- Võimalus võrrelda kahte piirkonda omavahel (laiendatav funktsioon)
- Näha piirkonnakaardil, millistes linnaosades toimub aktiivsem tehingute liikumine
3. Andmeallikad, väljad ja kasutusviisid
1. Maa-amet (CSV / XLSX, kvartaliandmed):
- mediaanhind (€)
- mediaanhind €/m²
- tehingute arv
- piirkond (maakond, vald, asula, linnaosa)
- sihtotstarve (elamumaa, ärimaa jne)
Kasutus: ajas muutuv statistika piirkonna kaupa, hinnatrendid
2. Ehitisregister (EHR, JSON / XML):
- aadress
- ehitusaasta
- korruseid
- energiamärgis
- materjal
- koordinaadid
Kasutus: piirkondliku hoonestusprofiili koostamine (näiteks keskmine vanus)
3. Statistikaamet (API / XLSX):
- eluaseme hinnaindeks (HPI)
- ehitushinnaindeks
- rahvastiku ja leibkondade arv piirkonniti
Kasutus: hinnadünaamika tõlgendamine inflatsiooni või ehitushindade kontekstis
4. WMS / WFS (GeoJSON):
- piirkondade geomeetria (halduspiirid, asulad, linnaosad)
Kasutus: kaardivaatel kuvamine ja visuaalne interaktsioon
4. Andmete ühendamise loogika
Andmed ühendatakse järgmiste väljade alusel:
- piirkond: maakond, omavalitsus, asula, linnaosa – kasutatakse nii tehinguandmetes kui WFS
GeoJSONis
- katastriüksuse tunnus või ehitis_ID: ühendab Ehitisregistri andmed Maa-ameti andmetega (vajadusel
kaudselt)
- periood (aasta, kvartal): võimaldab luua ajalisi graafikuid ja arvutada muutusi
Ühendamine toimub PostgreSQL/PostGIS andmebaasis vaadete või joinidega. Andmed normaliseeritakse
ETL-i käigus.
5. Ajas muutuv info ja kasutajale antav väärtus
- Kõik tehinguandmed sisaldavad ajatemplit (kvartal) ® võimaldab joonistada hinnagraafikuid
- Võimalik arvutada muutust €/m² osas võrreldes eelmise perioodiga
- Ehitusinfo lisab konteksti: piirkonnas palju vanu/moodsaid maju?
- Hindade võrdlus Statistikaameti HPI-ga ® kas piirkonna hinnatõus ületab või jääb alla keskmise
- Graafikud aitavad visuaalselt tõlgendada: kus hinnad kasvavad, kus stabiilsed
6. Näidisfunktsioon – piirkonna ülevaade
Kui kasutaja valib Mustamäe linnaosa, kuvatakse:
- Mediaanhind €/m² viimase 6 kvartali lõikes (joongraafik)
- Tehingute arv ajas (tulpdiagramm)
- Korterite osakaal vs elamud
- Ehitisregistri põhjal: keskmine ehitusaasta = 1978, peamine materjal: paneel
- Statistikaameti indeks: hinnatõus 2020-2024 = +32%
Kogu info toetab koduotsijat või investorit piirkonna mõistmisel ja otsuste tegemisel.