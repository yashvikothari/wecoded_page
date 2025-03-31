let allArticles = {
	wecoded: [],
	shecoded: []
}

// Fetch articles based on the provided tag
async function fetchArticles(tag = 'wecoded') {
	const apiUrl = `https://dev.to/api/articles?tag=${tag}`
	try {
		const response = await fetch(apiUrl)
		if (!response.ok)
			throw new Error(`HTTP error! status ${response.status}`)
		const articles = await response.json()
		allArticles[tag] = articles // Store articles globally for the specific tag
		applyFilters(tag) // Apply filters immediately after fetching
	} catch (error) {
		console.error('Failed to fetch articles:', error)
		const container = document.getElementById(`${tag}-articles-container`)
		container.innerHTML =
			'<p>Failed to load articles. Please try again later.</p>'
	}
}

// Apply filters and sort options
function applyFilters(tag) {
	const sortBy = document.getElementById(`${tag}-sort-by`).value
	const dateFilter = document.getElementById(`${tag}-date-filter`).value

	let filteredArticles = [...allArticles[tag]]

	// Apply date filter
	if (dateFilter) {
		filteredArticles = filteredArticles.filter(
			(article) => new Date(article.published_at) >= new Date(dateFilter)
		)
	}

	// Sorting logic
	if (sortBy === 'reactions') {
		filteredArticles.sort(
			(a, b) => b.public_reactions_count - a.public_reactions_count
		)
	} else if (sortBy === 'newest') {
		filteredArticles.sort(
			(a, b) => new Date(b.published_at) - new Date(a.published_at)
		)
	}

	renderArticles(filteredArticles, tag)
}

// Render articles in the container
function renderArticles(articles, tag) {
	const container = document.getElementById(`${tag}-articles-container`)
	container.innerHTML = '' // Clear previous articles

	if (articles.length === 0) {
		container.innerHTML = `<p>No articles found for the ${tag} tag.</p>`
		return
	}

	articles.forEach((article) => {
		const articleCard = document.createElement('div')
		articleCard.className = 'article-card'

		articleCard.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <div class="tags">
                ${article.tag_list.map((tag) => `<span>${tag}</span>`).join('')}
            </div>
            <a href="${article.url}" target="_blank">Read More</a>
        `

		container.appendChild(articleCard)
	})
}

// Switch tabs
function switchTab(tab) {
	// Hide all tab contents
	document
		.querySelectorAll('.tab-content')
		.forEach((content) => content.classList.remove('active'))
	// Remove active class from all tab buttons
	document
		.querySelectorAll('.tab-button')
		.forEach((button) => button.classList.remove('active'))

	// Show selected tab content
	document.getElementById(`${tab}-content`).classList.add('active')
	// Add active class to selected tab button
	document.getElementById(`${tab}-tab`).classList.add('active')

	// Fetch articles if not already fetched
	if (allArticles[tab].length === 0) {
		fetchArticles(tab)
	} else {
		applyFilters(tab)
	}
}

// Initial fetch on page load for the default tab
fetchArticles('wecoded')

// Event listeners for filters
document
	.getElementById('wecoded-sort-by')
	.addEventListener('change', () => applyFilters('wecoded'))
document
	.getElementById('wecoded-date-filter')
	.addEventListener('change', () => applyFilters('wecoded'))
document
	.getElementById('shecoded-sort-by')
	.addEventListener('change', () => applyFilters('shecoded'))
document
	.getElementById('shecoded-date-filter')
	.addEventListener('change', () => applyFilters('shecoded'))
