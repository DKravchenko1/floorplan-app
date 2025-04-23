export const ERROR_MESSAGES = {
  JSON_NO_ROOMS: 'Некорректный формат JSON: отсутствует массив rooms',
  JSON_INVALID_STRUCTURE: 'Некорректный формат JSON: неверная структура данных комнат',
  JSON_PARSE_ERROR: 'Некорректный формат JSON файла',
  NO_FLOOR_PLAN: 'Сначала загрузите план помещения',
  GENERATE_ZONING_ERROR: 'Ошибка при генерации зонирования. Проверьте консоль для деталей.',
  UNDO_ERROR: 'Произошла ошибка при отмене действия',
  REDO_ERROR: 'Произошла ошибка при повторе действия',
  STORAGE_ERROR: 'Ошибка при загрузке данных из localStorage'
};


export const SUCCESS_MESSAGES = {
  PLAN_LOADED: (count: number) => `План успешно загружен: ${count} комнат. Нажмите "Сгенерировать зонирование" для отображения.`,
  ZONING_GENERATED: (count: number) => `Зонирование успешно создано: ${count} зон. Помещения отображены на канвасе.`,
  EXAMPLE_DOWNLOADED: 'Пример JSON файла успешно скачан',
  ACTION_UNDONE: 'Действие отменено',
  ACTION_REDONE: 'Действие повторено'
};

export const BUTTON_TEXTS = {
  UPLOAD_PLAN: 'Загрузить план помещения (JSON)',
  GENERATE_ZONING: 'Сгенерировать зонирование',
  GENERATING: 'Генерация зонирования...',
  DOWNLOAD_EXAMPLE: 'Скачать пример JSON',
  UNDO: 'Назад',
  REDO: 'Вперед'
};

export const TOOLTIPS = {
  UNDO: 'Вернуться к предыдущему состоянию',
  REDO: 'Перейти к следующему состоянию'
};

export const HEADERS = {
  MAIN_TITLE: 'Планировщик зонирования помещений',
  UPLOAD_SECTION: 'Загрузка и генерация',
  CANVAS_TITLE: 'Канвас',
  ZONING_CANVAS_TITLE: 'План помещения с зонированием'
}; 