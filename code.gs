function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function handleFormSubmit(formData) {
  try {
    // ID вашей таблицы
    const spreadsheetId = "1sDSd6gzdrHHpaZz-pM8sk6SPF1d7uZXNwn6Yw0OucHk";
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Получаем первый лист (gid=0)
    const sheet = spreadsheet.getSheets()[0];
    
    const timestamp = new Date();
    
    // Добавляем данные в таблицу
    sheet.appendRow([
      timestamp,
      formData.name || "Не указано",
      formData.phone || "Не указано",
      formData.email || "Не указано",
      formData.message || "Без сообщения",
      "Новая заявка"
    ]);
    
    // Отправка email уведомления
    try {
      const emailBody = `
        Новая заявка с сайта:
        Имя: ${formData.name || "Не указано"}
        Телефон: ${formData.phone || "Не указано"}
        Email: ${formData.email || "Не указано"}
        Сообщение: ${formData.message || "Без сообщения"}
        Время отправки: ${timestamp}
      `;
      
      MailApp.sendEmail({
        to: "info@caravanrailway.uz",
        subject: "Новая заявка с сайта Caravan Railway",
        body: emailBody
      });
    } catch (emailError) {
      console.error("Ошибка отправки email: ", emailError);
      // Продолжаем работу даже если email не отправился
    }
    
    return { 
      status: "success", 
      message: "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время." 
    };
    
  } catch (error) {
    // Подробное логирование ошибки
    console.error("Критическая ошибка: ", error);
    
    return { 
      status: "error", 
      message: "Произошла техническая ошибка. Пожалуйста, свяжитесь с нами по телефону: +998 33 419 0878" 
    };
  }
}

// Вспомогательная функция для тестирования
function testFormSubmission() {
  const testData = {
    name: "Тестовое Имя",
    phone: "+998901234567",
    email: "test@example.com",
    message: "Тестовое сообщение"
  };
  
  const result = handleFormSubmit(testData);
  console.log(result);
}

// Функция для проверки записи в таблицу
function testSheetWrite() {
  const spreadsheet = SpreadsheetApp.openById("1sDSd6gzdrHHpaZz-pM8sk6SPF1d7uZXNwn6Yw0OucHk");
  const sheet = spreadsheet.getSheets()[0];
  
  sheet.appendRow([
    new Date(),
    "Тест",
    "Телефон",
    "test@test.com",
    "Тестовое сообщение",
    "Тестовая запись"
  ]);
  
  return "Тестовая запись добавлена!";
}