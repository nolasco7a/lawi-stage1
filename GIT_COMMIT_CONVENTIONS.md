# Git Commit Conventions

Este documento define las convenciones para mensajes de commit en el proyecto Lawi Stage 1.

## Formato General

```
<type>: <description>

[optional body]
```

## Tipos de Commit (Types)

- **feat**: Nueva funcionalidad o característica
- **fix**: Corrección de bugs
- **refactor**: Cambios en el código que no agregan features ni corrigen bugs
- **chore**: Tareas de mantenimiento, actualizaciones de dependencias, configuración
- **docs**: Cambios en documentación
- **style**: Cambios de formato, espacios, punto y coma (no afectan la lógica)
- **test**: Agregar o modificar tests
- **perf**: Mejoras de performance

## Reglas de Descripción

1. **Minúsculas**: La descripción debe comenzar en minúsculas
2. **Imperativo**: Usar tiempo presente imperativo ("add" no "added")
3. **Conciso**: Máximo 72 caracteres en la primera línea
4. **Sin punto final**: No terminar con punto
5. **Específico**: Describir QUÉ cambia, no CÓMO

## Ejemplos Correctos

```bash
feat: implement user and lawyer registration schemas
feat: added cases store and implement load logic to view and flow
feat: update layout and sidebar components
fix: pipe stream through sse transform even without redis
fix: race condition after resumable stream ends
refactor: remove Vercel deployment button from chat header
chore: update to ai sdk v5 beta
chore: update links to migration docs
```

## Ejemplos Incorrectos

```bash
❌ Added new feature  # Debe usar "feat:" y tiempo presente
❌ fix bug            # Muy vago, no describe qué bug
❌ Update files.      # Tiene punto final
❌ FEAT: NEW THING    # Todo en mayúsculas
❌ fixed the login    # Falta el tipo "fix:"
```

## Estructura Detallada (Opcional)

Para commits complejos, usar cuerpo del mensaje:

```
feat: implement subscription webhook handlers

- Add handleSubscriptionCreated for new subscriptions
- Add handleSubscriptionUpdated for status changes
- Implement is_active field management
- Add database helper functions for subscription queries
```

## Scope (Opcional)

Opcionalmente se puede agregar scope entre paréntesis:

```
feat(auth): add guest user support
fix(stripe): handle webhook race conditions
refactor(ui): simplify sidebar components
```

## Commits Multi-Componente

Cuando un commit afecta múltiples áreas:

```
feat: added cases UI, flow and upload file functionality, added chats store to handle load logic
```

## Breaking Changes

Para cambios que rompen compatibilidad, agregar `!` después del tipo:

```
feat!: migrate to Message_v2 schema
```

O en el cuerpo:

```
feat: update authentication system

BREAKING CHANGE: requires new environment variables for NextAuth
```

## Comandos Git Útiles

```bash
# Commit con mensaje
git commit -m "feat: add user profile page"

# Commit con cuerpo
git commit -m "feat: implement stripe webhooks" -m "- Add subscription handlers
- Update database schema
- Add webhook verification"

# Amend último commit (solo si no se ha pusheado)
git commit --amend -m "feat: fix typo in previous commit message"
```

## Checklist Pre-Commit

- [ ] El tipo es correcto (feat, fix, refactor, etc.)
- [ ] La descripción está en minúsculas
- [ ] No tiene punto final
- [ ] Es específico y claro
- [ ] Describe QUÉ cambia
- [ ] Menos de 72 caracteres
