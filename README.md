Install
===

```shell
npm install dictionary-builder
```

Usage
===

Building (merging)
---

```
i10n/
	messages.js
	main.json // <<-- MAIN DICTIONARY FILE
component/
	places/
		placesPreferences/
			Form.js
			form.l10n.json // <<-- CHAPTER FILE
		interactiveMap/
			Form.js
			description.l10n.json // <<-- CHAPTER FILE
	common/
		Input.js
		index.l10n.json // <<-- CHAPTER FILE
```

To build main dictionary file from chapters use the next command:

```shell
dictionary-builder -i ./test/resources/example/component -o ./test/resources/example/l10n/main.json --chapterFileMask *.l10n.json
```

**Parameters**

- **-i** REQUIRED. input folder;
- **-o** REQUIRED. output file;
- **--chapterFileMask** mask of chapter filename. By default used "*.json" 
- **--source** should be "chapter" for this process direction. Can be left blank

Splitting 
---

The process of distribution of changes in main dictionary file to **existing chapters**. 
Main file can be given to manager who will correct the tokens. 
The main purpose of the tool is to apply changes in main file to files in 
directories of components.

```shell
dictionary-builder -i ./test/resources/example/l10n/expected.json -o ./test/resources/example/splitted --model ./test/resources/example/component --source dictionary --chapterFileMask *.l10n.json
```

**Parameters**

- **-i** REQUIRED. input file;
- **-o** REQUIRED. output folder;
- **--source** REQUIRED should be "dictionary" for this process direction
- **--model** folder with existing chapters. By default used _output folder_. Script will use chapters in model directory to recognize where the JSON-brunches should store.
- **--chapterFileMask** mask of chapter filename. By default used "*.json" 

Notes
===

If you have existing main dictionary file with all tokens in it then the tool is not fully appropriate for you. 
The tool uses chapter_first approach. It means that you have to split your main file with directory structure manually. 
Then the tool can have any price for you. Why?

At first glance I have no ide how to split main file without any model. For example you have:

```json
{
    "en": {
        "toolbar": {
            "user": {
                "session": {
                    "logged_in": "You are logged in as"
                }
            }
        }
    },
... 
```

What structure of folders do you want at the end?

```
/l10n
    toolbar/
        user/
            session.l10n.json
```

with 

```json
// l10n/toolbar/user/session.l10n.json
{
    "en": {
        "logged_in": "You are logged in as"
    },
    ...
}
```

OR


```
/l10n
    toolbar.l10n.json
```

with 

```json
// l01n/toolbar.l10n.json
{
    "en": {
        "user": {
            "session": {
                "logged_in": "You are logged in as"
            }
        }
    },
    ...
}
```

Or any other combination? 

May be the tool should use some kind on convention to solve the problem, but at the moment it doesn't.

Steps of using:
---

 1. Create chapters in some folders structure
 1. Run _build_
 1. Amend main.json
 1. Run _split_

Мысли по организации файлов локализации нашего проекта с ReactJs
===

Цель
---

Словать токенов для нашего веб приложения, который будет использоваться [ReactIntl](https://github.com/yahoo/react-intl)

Пожелания
---

Для программиста:

- понятная структура файла локализации. Возможно, привязка к структуре папок компонентов
- ограниченный размер файла
- возможность дублирования токенов в разных компонентах
- хранение файлов локализации под контролем git
- возможность предоставить словать на редактирование оператору
- возможность иметь древовидную структуру токенов внутри файла локализации (имеется в виду 2 вида структурирования: по папкам и как родитель/ребёнок внутри json файла)

Для оператора:

- поиск по тексту токена
- поиск по структуре приложения

Идеи
---

Пусть система локализации имеет главы. 

Глава - это отдельный json-файлик, который разполагается в директории компонента, который будет его использовать. Тут будут лежать все токены, которые компонент использует. 

Нужно создать скрипт, который будет иметь возможность сборки глав в главный файл локализации. Сейчас это /l10n/messages.js

Также нужен скрипт, который сможет выполнять обраное действие. То есть раскидывать изменения в главном файле локализации по файлам, находящимся в директориях компонентов.

Первый способ удобен программисту, так как он имеет маленький файл в директории компонента, имеющий токены относящиеся только к нужному компоненту. И нет необходимости рыться в огромном общем файле для мелких правок.

Второй способ удобен для програмста, когда он дал собранный словарь оператору для изменений. Оператор поправил файл и вернул его программисту. Программист должен:

- заменить главный файл локализации в проекте
- при помощиу каких-либо утилит просмотреть правки оператора и удостовериться, что он не сломал структуру JSON файла. 
- запустить скрипт раскидывающий изменения по главам локазизации на уровне компонентов.

Структура компонентов должна при этом быть удобочитаемой. Чтобы оператор при взгляде на интерфейс приложения и JSON файл разобраться в какой ветке находится нужный ему токен. Возможно потребуется следование какой-нибудь конвенции в именовании компонентов.

По большому файлу локализации не проблема найти токен по его тексту. 

Идеальный пример
---

```
i10n/
	messages.js
	main.json
component/
	places/
		placesPreferences/
			Form.js
			form.l10n.json
		interactiveMap/
			Form.js
			description.l10n.json
	common/
		Input.js
		index.l10n.json
```

```js
// /component/places/placesPreferences/form.l10n.json
{
	'en-GB': {
		places_range: 'Place range'
	},
	'ru-RU': {
		places_range: 'Диапазон мест'
	}
}
```

```js
// /component/places/interactiveMap/description.l10n.json
{
	'en-GB': {
		title: 'Service class description'
	},
	'ru-RU': {
		title: 'Описание класса'
	}
}
```


```js
// /component/common/index.l10n.json
{
	'en-GB': {
		errors: {
			uncaught_exception: 'Uncaught exception. Try to refresh the page'
		}
	},
	'ru-RU': {
		errors: {
			uncaught_exception: 'Неопознаная ошибка, попробуйте перезагрузить страницу'
		}
	}
}
```


```js
// /l10n/main.l10n.json
{
	'en-GB': {
		places: {
			placesPreferences: {
				form: {
					places_range: "Places range"
				}
			},
			interactiveMap: {
				description: {
					title: 'Service class description'
				}
			}
		},
		common: {
			errors: {
				uncaught_exception: 'Uncaught exception. Try to refresh the page'
			}
		}
	},
	'ru-RU': {
		...
	}
}
```

Обращение в коде:

```js
this.getIntlMessage('places.places_range.form.places_range');

```