Install
===

```shell
npm install dictionary-builder
```

Usage
===

Building
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
dictionary-builder -i ./test/resources/example/component -o ./test/resources/example/l10n
```

**Parameters**

- _-i_: REQUIRED. input folder;
- _-o_: REQUIRED. output file;
- _--chapterFileMask_: mask of chapter filename. By default used "*.json" 
- _--source_: should be "chapter" for this process direction. Can be left blank

Splitting 
---

The process of distribution of changes in main dictionary file to **existing chapters**. 
The main purpose is to give the main file to manager who will correct the tokens and then apply changes to files in 
directories of components.

```shell
dictionary-builder -i ./test/resources/example/l10n/expected.json -o ./test/resources/example/splitted --model ./test/resources/example/component --source dictionary --chapterFileMask *.l10n.json
```

**Parameters**

- _-i_: REQUIRED. input file;
- _-o_: REQUIRED. output folder;
- _--source_: REQUIRED should be "dictionary" for this process direction
- _--model_: folder with existing chapters. By default used _output folder_. Script will use chapters in model directory to recognize where the JSON-brunches should store.
- _--chapterFileMask_: mask of chapter filename. By default used "*.json" 


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