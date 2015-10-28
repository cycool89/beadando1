# Beadandó
###Beadandó az Alkalmazások fejlesztése c. tárgyhoz
###Kigyós János
######LQPTEW
======
##Követelményanalízis
======
A feladat egy munkaidő nyilvántartó alkalmazás fejlesztése.
Lehessen felhasználóknak (munkavállalóknak, főnököknek) regisztrálni és
regisztráció után beléphessenek.
Belépéskor meg tudják nézni és tudják szerkeszteni az eddigi munkaidejüket
érkezés távozással nyílvántartva.
Főnökként legyen lehetőség a munkaidő törlésére.

======
##Tervezés
======
####Oldaltérkép
- Főoldal
  - Bejelentkezés
  - Regisztráció

- Főoldal (bejelentkezve)
  - Munkaidőm
  - Profil szerkesztése
  - Kijelentkezés

======

- Felhasználóifelület-modell
  - Oldalvázlatok
  - Designterv (nem kell, elég a végső megvalósítás kinézete)
- Osztálymodell
  - Adatbázisterv
======
##Implementáció
======
Az alkalmazás a [Colud9](http://c9.io) felületen, nodejs eszközzel lett megvalósítva.
MVC mintát követ: (Mappaszerkezet)
- models
- controllers
- views
  - mappákban az egyes controllerek nézetei
- public
  - kliens oldalhoz szükséges stylus lapok/scriptek

======
##Tesztelés
======

======
##Felhasználói dokumentáció
======
Miután megnyitottuk a böngészőben az alkalmazást, láthatjuk a regisztrált alkalmazottak listáját
és hogy benn tartózkodnak-e.
Az alkalmazásba regisztrációt követően tudunk belépni.
Alapértelmezetten alkalmazott jogosultságokat kap a felhasználó. Ezt és a nevét tudja módosítani belépés után
a Profil szerkesztése menüpont alatt. Profil mentése után a program kilépteti a felhasználót, hogy az adatokat mentse és frissítse.
Ezt követően újra be kell lépni.
Belépés után megtekinthetjük a saját munkaidőnket a Munkaidőm menüpont alatt. Itt összesítve és egységekre bontva is megtekinthető
a munkaidő. Főnök jogosultságok esetén lehetőség van törölni egy-egy munkaidő-t a Törlés-re kattintva.
Munka befejeztével kattintsunk a Kijelentkezés-re.