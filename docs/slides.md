# Évolution de l’écosystème .NET
## De .NET Framework 4.8 à .NET 8/10
### C# • ASP.NET Core • Trajectoire LTS

Note:
Public : développeurs .NET intermédiaires.
Objectif : préparer une montée progressive sans gel de prod.

---

## Objectifs de la session
- Comparer .NET Framework 4.8 vs .NET 8 côté Web API
- Voir les vraies avancées C# utiles au quotidien
- Identifier ce que ça change pour l’équipe maintenant

Note:
Pas de plan de migration détaillé aujourd’hui. Factuel, concret.

---

## Agenda
- Plateforme : ce qui change vraiment de 4.8 à 8
- C# : évolutions majeures (7.3 → 12)
- Web API : delta concret (hosting, config, perf)
- Synthèse
- Questions

Note:
Focus sur les écarts majeurs. Les détails seront pour une prochaine session.

---

# Plateforme .NET : 4.8 vs 8

--

## .NET Framework 4.8 aujourd’hui
- Stable, supporté, fiable
- **Figé** : pas de nouvelles fonctionnalités
- Windows-only, IIS couplé

Note:
.NET Framework vit en maintenance. L’innovation est côté .NET moderne.
Pas de HTTP/2/3 natif, pas de trimming / container images légères.

--

## .NET 8 (LTS)
- Cross-plateforme (Windows/Linux/containers)
- Kestrel par défaut, IIS ou Nginx en reverse proxy
- Config JSON + options, DI native, middleware pipeline
- Gains perf noyau (JIT, GC, sockets, HTTP/2/3)

Note:
Le saut n’est pas que syntaxique : hosting, perf et tooling changent.
Perf : HTTP/2/3, JSON source generators, pooling sockets, GC server. Infra : PublishTrimmed/AOT (optionnel), Single-file, containers distroless.

--

## Ce qui change pour les devs
- SDK unifié : `dotnet build/test/publish`
- Projets SDK-style (csproj léger, références implicites)
- Tooling Roslyn/analyzers, nullable et warnings utiles
- Templates Web API modernes (controllers + minimal APIs)

Note:
Moins de config XML, plus de conventions. Les habitudes de build changent peu.
Nouveau tooling : `dotnet format`, analyzers Roslyn, hot reload, `dotnet user-secrets`.

--

## Outillage qui aide (immédiat)
- `dotnet format` + analyzers (warnings en errors sur CI)
- Hot reload pour les démos/itérations rapides
- Templates SDK-style et `dotnet new api`

Note:
Mettre les analyzers en warning-as-error sur un périmètre pilote avant généralisation.

--

## Sécu / secrets (dev)
- `dotnet user-secrets` pour le local
- Config par environnement (appsettings.Development.json)
- Certificats dev : `dotnet dev-certs https --trust`
- Pas de secrets dans `appsettings.json`

Note:
Rappel simple pour éviter les fuites de secrets en repo/CI.

---

# C# 7.3 → 12 : les gros apports

--

## Pattern matching
```csharp
return status switch
{
    200 => "OK",
    404 => "Not Found",
    _   => "Error"
};
```

Note:
Lisibilité immédiate, moins d’embranchements verbeux.
Depuis C# 9/10 : patterns relationnels/logiques, list patterns (C# 11) utiles pour valider des payloads.

--

## Records & with-expressions
```csharp
public record UserDto(int Id, string Name);

var updated = user with { Name = "Jane" };
```

Note:
Messages immuables, faciles à comparer, moins de boilerplate.
Records supportent l’égalité structurale et les `with` pour les copies partielles.

--

## Nullable reference types
```csharp
string? name = GetName();
if (name is not null) Console.WriteLine(name.Length);
```

Note:
Les nulls deviennent explicites. On déplace les bugs vers la compilation.
Activer `nullable enable` génère des warnings guidant les corrections. Faire sur un sous-projet/dossier pilote pour lisser l’effort.

--

## Async/await partout + async streams
```csharp
var users = await _repository.GetAllAsync();
return Results.Ok(users);
```

Note:
IO non bloquants de bout en bout. Async streams (`IAsyncEnumerable<T>`) et cancellation mieux propagée.

--

## Span/Memory (perf sans allocations)
```csharp
ReadOnlySpan<byte> buffer = stackalloc byte[64];
// Traitement sans allocations intermédiaires
```

Note:
Optimisations ciblées possibles quand on touche aux perfs réseau/IO.
System.Text.Json, Kestrel et pipelines s’appuient sur Span/Memory pour limiter les allocations.

--

## FAQ C#
- Obligatoire ? Non, opt-in par projet.
- Progressif ? Oui, feature par feature.
- Compatibilité ? Forte avec le code existant, compiler warn d’abord.

Note:
Stratégie : activer les nullable warnings d’abord, puis records/patterns.

---

# Web API : 4.8 vs 8

--

## Architecture : le delta clé

| Web API 2 (.NET 4.8) | ASP.NET Core |
|----------------------|--------------|
| System.Web + IIS     | Kestrel + middleware, IIS/Nginx en reverse proxy |
| Global.asax          | Program.cs minimal |
| Web.config           | appsettings.json + options |
| DI externe           | DI native (`AddScoped`, etc.) |
| Hébergement Windows  | Cross-plateforme, conteneurs |
| HttpModules/Handlers | Middleware pipeline |

Note:
On garde les concepts métier, on change l’hébergement et la config.
JSON par défaut via System.Text.Json (plus rapide, source-gen possible). Middleware remplace modules/handlers.

--

## Controller classique en ASP.NET Core
```csharp
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;
    public UsersController(IUserService service) => _service = service;

    [HttpGet("{id}")]
    public IActionResult Get(int id) => Ok(_service.Get(id));
}
```

Note:
Très proche de Web API 2. DI et attributs similaires.
Filtrage, conventions de routes et validations restent familiers.

--

## Minimal API (pour exposer vite)
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();
app.MapGet("/api/users/{id}", async (int id, IUserService svc) =>
{
  if (id <= 0) return Results.BadRequest();
  var user = await svc.GetAsync(id);
  return user is null ? Results.NotFound() : Results.Ok(user);
});

app.Run();
```

Note:
Utile pour endpoints simples, health checks, PoC. Controllers restent pertinents pour le reste.
Binding simplifié, résultats typés (`Results`). Peut cohabiter avec controllers.

--

## Perf Web API (.NET 8)
- System.Text.Json par défaut, source generators disponibles
- HTTP/2 et HTTP/3 supportés
- Output caching et rate limiting intégrés
- Kestrel + pooling sockets / GC server

Note:
Source-gen JSON réduit allocations/cpu. HTTP/2/3 utile si proxy/clients compatibles.

--

## Source-gen JSON (exemple)
```csharp
[JsonSerializable(typeof(UserDto))]
internal partial class AppJsonContext : JsonSerializerContext;

var json = JsonSerializer.Serialize(user, AppJsonContext.Default.UserDto);
```

Note:
Pas de changement métier, juste moins d’allocations. À activer sur les DTO des endpoints chauds.

--

## Pipeline middleware
- Logging structuré
- AuthN/AuthZ (`UseAuthentication`, `UseAuthorization`)
- CORS, compression, rate limiting
- Endpoints (controllers ou minimal APIs)

Note:
Ordre important. Middleware = substitut aux HttpModules/Handlers.
Rate limiting et output caching sont fournis out-of-the-box en .NET 8.

--

## FAQ Web API
- Réécriture complète ? Non, métier conservé.
- Performances ? + grâce à Kestrel, pooling, JSON plus rapide.
- Hébergement ? IIS, Linux + Nginx, ou containers.

Note:
Clé : découpler le métier du framework via DI/tests pour limiter l’effort.
Perf JSON : System.Text.Json + source-gen > Newtonsoft dans la majorité des cas.

---

# Ce qu’il faut retenir
- .NET 8 apporte hosting moderne, perf et cross-plateforme — sans changer votre métier Web API
- C# moderne réduit le bruit (pattern matching, records, nullable) et sécurise la base
- Pipeline middleware + DI native simplifient l’infra et améliorent les perfs

Note:
Les détails d’upgrade outillage/process pourront être couverts dans une session dédiée.

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