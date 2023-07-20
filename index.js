const currencySelector = document.querySelector('.currencySelector')
const currencyId = document.querySelector('.currencyId')
const currencyName = document.querySelector('.currencyName')
const currencyCode = document.querySelector('.currencyCode')
const currencyDate = document.querySelector('.currencyDate')
const previousDate = document.querySelector('.previousDate')
const currentCurrency = document.querySelector('.currentCurrency')
const previousCurrency = document.querySelector('.previousCurrency')

fetch('https://www.cbr-xml-daily.ru/daily_json.js')
	.then((response) => response.json())
	.then((data) => {
		for (const currency in data.Valute) {
			const option = document.createElement('option')
			option.value = currency
			option.text = `${data.Valute[currency].ID} - ${data.Valute[currency].Name}`
			currencySelector.appendChild(option)
		}

		const selectedCurrency = currencySelector.value
		updateCurrencyInfo(selectedCurrency, data)
	})
	.catch((error) => console.error('Error fetching data:', error))

currencySelector.addEventListener('change', (event) => {
	const selectedCurrency = event.target.value
	fetch('https://www.cbr-xml-daily.ru/daily_json.js')
		.then((response) => response.json())
		.then((data) => updateCurrencyInfo(selectedCurrency, data))
		.catch((error) => console.error('Error fetching data:', error))
})

function updateCurrencyInfo(currency, data) {
	const selectedCurrencyData = data.Valute[currency]
	currencyId.textContent = selectedCurrencyData.ID
	currencyName.textContent = selectedCurrencyData.Name
	currencyCode.textContent = selectedCurrencyData.CharCode
	currencyDate.textContent = formatDateTime(data.Date)
	previousDate.textContent = formatDateTime(data.PreviousDate)
	currentCurrency.textContent = selectedCurrencyData.Value
	previousCurrency.textContent = selectedCurrencyData.Previous
}

function formatDateTime(dateTimeStr) {
	const dateTime = new Date(dateTimeStr)
	return dateTime.toLocaleString('en-GB')
}
