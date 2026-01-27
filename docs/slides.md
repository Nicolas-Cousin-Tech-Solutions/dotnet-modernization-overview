# Évolution de l’écosystème .NET
## De .NET Framework 4.8 à .NET 8
### C# • ASP.NET API • Trajectoire LTS

Note:
Session d’évolution.
Pas de projet de migration immédiat.
Objectif : comprendre pour mieux décider plus tard.

---

## Objectifs
- Comprendre l’évolution de .NET
- Identifier les impacts développeur
- Se projeter dans une trajectoire maîtrisée

Note:
Comprendre ≠ migrer maintenant.

---

# .NET : Évolution de la plateforme

--

## .NET Framework 4.8 aujourd’hui
- Stable
- Supporté
- Fiable
- **Figé**

Note:
.NET Framework n’est pas mort.
Il est sécurisé mais n’évolue plus.

--

## Support ≠ évolution
- Correctifs : oui
- Sécurité : oui
- Nouvelles fonctionnalités : non

Note:
Support ne veut pas dire modernité.
Toute l’innovation est côté .NET moderne.

--

## Analogie terrain (banque)
- Plateformes anciennes mais supportées
- Environnements critiques
- Fonctionnel volontairement maîtrisé

Note:
Retour d’expérience libre-service bancaire.
La stabilité prime sur l’innovation rapide.

--

## Point clé
### La plateforme technique borne le fonctionnel

Note:
Phrase clé à dire :
"On peut coder… mais pas toujours concevoir librement."

--

## FAQ — Plateforme
- Peut-on rester en .NET 4.8 ?
- Quel est le risque réel ?
- Quand ça devient bloquant ?

Note:
Oui, on peut rester tant que le contexte le permet.
Le risque est progressif : dette technique, limites fonctionnelles.
Ça devient bloquant quand on veut évoluer.

---

# C# : évolution du langage

--

## Pourquoi le langage a évolué
- Lisibilité
- Sécurité
- Expressivité

Note:
C# a évolué pour aider le développeur, pas pour le compliquer.

--

## AVANT — C# 7.3
```csharp
if (status == 200)
{
    return "OK";
}
else if (status == 404)
{
    return "Not Found";
}
else
{
    return "Error";
}
```

Note:
Beaucoup de bruit pour une intention simple.

--

## APRÈS — C# moderne
```csharp
return status switch
{
    200 => "OK",
    404 => "Not Found",
    _   => "Error"
};
```

Note:
Même logique.
Phrase clé :
"On lit l’intention, pas la mécanique."

--

## AVANT — DTO classique
```csharp
public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; }

    public UserDto(int id, string name)
    {
        Id = id;
        Name = name;
    }
}
```

Note:
Beaucoup de code pour un simple message.

--

## APRÈS — record
```csharp
public record UserDto(int Id, string Name);
```

Note:
Même rôle fonctionnel.
Immuable par défaut.
Moins de dette technique.

--

## AVANT — null implicite
```csharp
string name = GetName();
Console.WriteLine(name.Length);
```

Note:
Risque invisible à la compilation.

--

## APRÈS — nullable explicite
```csharp
string? name = GetName();

if (name != null)
{
    Console.WriteLine(name.Length);
}
```

Note:
Phrase clé :
"On déplace les bugs de la prod vers la compilation."

--

## FAQ — C#
- Est-ce obligatoire ?
- Progressif ?
- Compatible ?

Note:
Tout est opt-in.
Adoption progressive, par projet, sans rupture.

---

# ASP.NET Web API : évolution

--

## ASP.NET Web API (.NET 4.8)
- System.Web
- Global.asax
- Web.config
- Couplage IIS

Note:
Modèle historique, très connu.

--

## ASP.NET Web API : comparaison

| Web API 2 (.NET 4.8) | ASP.NET Core Web API |
|---------------------|----------------------|
| System.Web          | Pipeline middleware  |
| Global.asax         | Program.cs           |
| Web.config          | appsettings.json     |
| IIS obligatoire     | Auto-hébergé possible |
| DI externe          | DI native            |

Note:
Vue macro structurelle.
Phrase clé :
"Les concepts restent proches, c’est l’infrastructure qui change."

--

## AVANT — Web API 2
```csharp
[ApiController]
[Route("api/users")]
public class UsersController : ApiController
{
    [HttpGet("{id}")]
    public IHttpActionResult Get(int id)
    {
        var user = _service.Get(id);
        return Ok(user);
    }
}
```

Note:
Code fonctionnel, dépendant de System.Web.

--

## APRÈS — ASP.NET Core
```csharp [|3|6]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var user = _service.Get(id);
        return Ok(user);
    }
}
```

Note:
Même métier.
Phrase clé :
"On ne réécrit pas le métier, on change l’hébergement."

--

## Ce qui ne change pas
- Controllers
- Routing
- Métier
- JSON

Note:
Point rassurant.

--

## FAQ — Web API
- Réécriture complète ?
- Contrôleurs différents ?
- Performances ?

Note:
Non.
Très proches.
Souvent meilleures sans effort.

---

# Cadence .NET & Trajectoire LTS

--

## Comment évolue .NET
- 1 version / an
- LTS tous les 2 ans
- STS rarement en production

Note:
En entreprise, on raisonne LTS → LTS.

--

## Situation au 24/01/2026
- .NET 8 : LTS (fin 11/2026)
- .NET 9 : STS
- .NET 10 : LTS (depuis 11/2025)

Note:
.NET 8 est un choix validé et sain.

--

## AVANT — vrai changement
- .NET Framework → .NET moderne
- Changement de plateforme

Note:
C’est le vrai saut technologique.

--

## APRÈS — montée LTS
- .NET 8 → .NET 10
- Même plateforme

Note:
Phrase clé :
"Le vrai saut est derrière nous."

--

## FAQ — LTS
- Pourquoi pas attendre .NET 10 ?
- .NET 8 trop court ?
- Nouvelle migration ?

Note:
Attendre bloque la modernisation.
8 → 10 est une montée de version.

---

## Conclusion
- .NET 8 est un point d’entrée
- Le vrai saut est déjà fait
- La trajectoire est maîtrisée

Note:
Phrase de clôture :
"On modernise maintenant pour ne pas subir plus tard."

---

## Questions

<div style="text-align:center; margin:2rem 0;">
  <img src="qr-code-presentation.png" alt="QR Code - Lien vers la présentation" style="width:200px; border:1px solid #ccc; padding:0.5rem; background:white;"/>
  <p style="font-size:0.7em; margin-top:1rem;">Scannez pour accéder à la présentation</p>
</div>

<div style="margin-top:4rem; font-size:0.5em; line-height:1.35; opacity:0.6;">
  © 2026 — Support pédagogique.<br/>
  Usage formation et sensibilisation. Réutilisation ou diffusion externe à valider.
</div>

---

## Ressources

### 📦 Dépôt GitHub
[github.com/Nicolas-Cousin-Tech-Solutions/dotnet-modernization-overview](https://github.com/Nicolas-Cousin-Tech-Solutions/dotnet-modernization-overview)

### 📄 Télécharger le PDF
[dotnet-modernization-overview.pdf](https://nicolas-cousin-tech-solutions.github.io/dotnet-modernization-overview/exports/dotnet-modernization-overview.pdf)

<div style="margin-top:4rem; font-size:0.5em; line-height:1.35; opacity:0.6;">
  © 2026 — Support pédagogique.<br/>
  Usage formation et sensibilisation. Réutilisation ou diffusion externe à valider.
</div>