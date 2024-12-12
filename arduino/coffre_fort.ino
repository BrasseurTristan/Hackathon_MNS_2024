#include <Wire.h> 
#include <LiquidCrystal_I2C.h> // Bibliothèque pour contrôler un écran LCD via I2C
#include <Keypad.h>            // Bibliothèque pour la gestion du clavier matriciel
#include "Servo.h"             // Bibliothèque pour contrôler le servo-moteur

Servo servo;                   // Création d'un objet Servo pour contrôler un servo-moteur
#define Password_Length 8      // Définition de la longueur maximale du mot de passe

int signalPin = 12;            // Définition du numéro de la broche pour le signal de verrouillage

// Déclarations des variables pour la gestion du mot de passe
char Data[Password_Length];    // Tableau pour stocker le mot de passe saisi
char Master[Password_Length] = "570BDA#"; // Mot de passe maître prédéfini
byte data_count = 0;           // Compteur pour suivre le nombre de caractères saisis
bool Pass_is_good;             // Variable pour vérifier si le mot de passe est correct
char customKey;                // Variable pour stocker la touche saisie

// Définition des dimensions du clavier matriciel (4x4)
const byte ROWS = 4;           // Nombre de lignes
const byte COLS = 4;           // Nombre de colonnes

// Définition des touches du clavier matriciel
char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

// Définition des broches connectées aux lignes et colonnes du clavier
byte rowPins[ROWS] = {9, 8, 7, 6};   // Broches des lignes
byte colPins[COLS] = {5, 4, 3, 2};   // Broches des colonnes

// Initialisation de l'objet Keypad avec la configuration du clavier
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

// Initialisation de l'écran LCD (adresse I2C 0x27, écran 16x2)
LiquidCrystal_I2C lcd(0x27, 16, 2);  

void setup() {
  lcd.init();               // Initialisation de l'écran LCD
  lcd.backlight();          // Activation du rétroéclairage de l'écran
  pinMode(signalPin, OUTPUT); // Configuration de la broche signalPin comme sortie
  servo.attach(12);         // Association du servo-moteur à la broche 10

  servo.write(0);           // Initialisation du servo à 0 degré
  delay(1000);              // Pause pour s'assurer que le servo atteint la position initiale
}

void loop() {
  lcd.setCursor(0, 0);      // Positionnement du curseur au début de l'écran
  lcd.print("Mot de passe:"); // Affichage du texte "Mot de passe:"

  customKey = customKeypad.getKey(); // Lecture de la touche saisie
  if (customKey) {                   // Si une touche a été pressée
    Data[data_count] = customKey;    // Stockage de la touche dans le tableau Data
    lcd.setCursor(data_count, 1);    // Positionnement du curseur pour afficher le caractère
    lcd.print(Data[data_count]);     // Affichage du caractère saisi
    data_count++;                    // Incrémentation du compteur de caractères
  }

  // Si le nombre de caractères saisis atteint la longueur du mot de passe
  if (data_count == Password_Length - 1) {
    lcd.clear();                     // Effacement de l'écran LCD

    // Comparaison du mot de passe saisi avec le mot de passe maître
    if (!strcmp(Data, Master)) {    // Si les deux mots de passe correspondent
      lcd.print("Ouvert");          // Affichage du message "Ouvert"
      digitalWrite(signalPin, HIGH); // Activation du signal pour ouvrir
      servo.write(150);               // Déplacement du servo-moteur à 90 degrés
      delay(1000);                  // Attente de 5 secondes
      digitalWrite(signalPin, LOW);  // Désactivation du signal
      servo.write(0);               // Retour du servo-moteur à sa position initiale
    } else {                        // Si le mot de passe est incorrect
      lcd.print("Incorrect");       // Affichage du message "Incorrect"
      delay(1000);                  // Attente d'une seconde
    }
    
    lcd.clear();                     // Effacement de l'écran LCD
    clearData();                     // Réinitialisation du tableau Data
  }
}

// Fonction pour réinitialiser les données saisies
void clearData() {
  while (data_count != 0) {          // Tant que le compteur n'est pas nul
    Data[data_count--] = 0;          // Réinitialisation des caractères un par un
  }
  return;
}