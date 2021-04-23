# Office Check-In Deployment-Anleitug

Grundlegende Schritte zur Einrichtung des Projektes finden Sie in der README.md

## Firebase
Firebase wird benötigt, um die Benutzerauthentifizierung und Benutzerverwaltung zu ermöglichen.
Anleitungen zur Einrichtung von Firebase finden Sie in der Datei README.md

## Anpassungen 
Nachdem Firebase eingerichtet wurde, müssen Sie zunächst Anpassungen an Ihr Unternehmen vornehmen. In der Datei ``src/styles.scss`` finden Sie wichtige Variablen zur Farbgestaltung.
Tauschen Sie außerdem die Datei ``favicon.ico``. 
Weitere Änderungen müssen im Code vorgenommen werden. Dazu gehören die Hintergrundbilder, die Standorte und die Texte für z.B. die Besucherbestätigung.

## Deployment
Führen Sie ``ng build --prod `` aus, um eine produktive Applikation zu bauen. Nachdem dies geschehen ist, müssen Sie ein Docker-Image bauen. Pushen Sie das erstellte Image in eine benutzerdefinierte Container-Registry.
Anschließend führen Sie die Schritte zum Deployment der Applikation durch. Diese finden Sie im Backend-Repo in der READEM.md.
