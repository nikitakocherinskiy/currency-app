interface ICurrencyData {
	Date: string
	PreviousDate: string
	PreviousURL: string
	Timestamp: string
	Valute: {
		[currencyCode: string]: {
			ID: string
			NumCode: string
			CharCode: string
			Nominal: number
			Name: string
			Value: number
			Previous: number
		}
	}
}

const currencySelector =
	document.querySelector<HTMLSelectElement>('.currencySelector')
const currencyId = document.querySelector<HTMLSpanElement>('.currencyId')
const currencyName = document.querySelector<HTMLSpanElement>('.currencyName')
const currencyCode = document.querySelector<HTMLSpanElement>('.currencyCode')
const currencyDate = document.querySelector<HTMLSpanElement>('.currencyDate')
const previousDate = document.querySelector<HTMLSpanElement>('.previousDate')
const currentCurrency =
	document.querySelector<HTMLSpanElement>('.currentCurrency')
const previousCurrency =
	document.querySelector<HTMLSpanElement>('.previousCurrency')

async function fetchData(): Promise<ICurrencyData> {
	try {
		const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error
	}
}

async function populateCurrencyOptions(): Promise<void> {
	try {
		const data = await fetchData()
		for (const currency in data.Valute) {
			const option = document.createElement('option')
			option.value = currency
			option.text = `${data.Valute[currency].ID} - ${data.Valute[currency].Name}`
			currencySelector!.appendChild(option)
		}

		const selectedCurrency = currencySelector!.value
		updateCurrencyInfo(selectedCurrency, data)
	} catch (error) {
		console.error('Error populating currency options:', error)
	}
}

currencySelector!.addEventListener('change', async (event) => {
	const selectedCurrency = (event.target as HTMLSelectElement).value
	try {
		const data = await fetchData()
		updateCurrencyInfo(selectedCurrency, data)
	} catch (error) {
		console.error('Error updating currency information:', error)
	}
})

function updateCurrencyInfo(currency: string, data: ICurrencyData) {
	const selectedCurrencyData = data.Valute[currency]
	currencyId!.textContent = selectedCurrencyData.ID
	currencyName!.textContent = selectedCurrencyData.Name
	currencyCode!.textContent = selectedCurrencyData.CharCode
	currencyDate!.textContent = formatDateTime(data.Date)
	previousDate!.textContent = formatDateTime(data.PreviousDate)
	currentCurrency!.textContent = selectedCurrencyData.Value.toString()
	previousCurrency!.textContent = selectedCurrencyData.Previous.toString()
}

function formatDateTime(dateTimeStr: string): string {
	const dateTime = new Date(dateTimeStr)
	return dateTime.toLocaleString('en-GB')
}

populateCurrencyOptions()
