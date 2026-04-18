// PulseMetrics - Core Data Engine
const salesData = [
    { month: "Jan", amount: 12000, orders: 28 },
    { month: "Feb", amount: 18000, orders: 35 },
    { month: "Mar", amount: 9000, orders: 22 },
    { month: "Apr", amount: 25000, orders: 42 }
];

const productsData = [
    { rank: 1, name: "MacBook Pro", category: "Electronics", sales: 42000, units: 42, contribution: "34%" },
    { rank: 2, name: "Dell Monitor", category: "Electronics", sales: 28000, units: 56, contribution: "22%" },
    { rank: 3, name: "Logitech Keyboard", category: "Accessories", sales: 15000, units: 150, contribution: "12%" },
    { rank: 4, name: "iPhone 15", category: "Electronics", sales: 12500, units: 25, contribution: "10%" },
    { rank: 5, name: "AirPods Pro", category: "Audio", sales: 8200, units: 82, contribution: "7%" }
];

// Function to render bar chart
function renderBarChart(containerId, data, valueKey, labelKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    data.forEach(item => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = item[labelKey];
        
        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        const maxValue = Math.max(...data.map(d => d[valueKey]));
        const widthPercent = (item[valueKey] / maxValue) * 100;
        fill.style.width = `${widthPercent}%`;
        fill.textContent = `$${item[valueKey].toLocaleString()}`;
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = `$${item[valueKey].toLocaleString()}`;
        
        barItem.appendChild(label);
        barItem.appendChild(fill);
        barItem.appendChild(value);
        container.appendChild(barItem);
    });
}

// Function to update KPI totals
function updateKPIs() {
    const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
    
    const totalSalesElem = document.getElementById('totalSales');
    const totalOrdersElem = document.getElementById('totalOrders');
    
    if (totalSalesElem) totalSalesElem.textContent = `$${totalSales.toLocaleString()}`;
    if (totalOrdersElem) totalOrdersElem.textContent = totalOrders;
}

// Function to handle filter
function setupFilter() {
    const filter = document.getElementById('monthFilter');
    if (!filter) return;
    
    filter.addEventListener('change', (e) => {
        const selected = e.target.value;
        const resultDiv = document.getElementById('filterResult');
        
        if (selected === 'all') {
            const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
            const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
            resultDiv.innerHTML = `
                <p>Selected: All Months</p>
                <p>Total Revenue: $${totalSales.toLocaleString()}</p>
                <p>Total Orders: ${totalOrders}</p>
            `;
        } else {
            const monthData = salesData.find(item => item.month === selected);
            if (monthData) {
                resultDiv.innerHTML = `
                    <p>Selected: ${selected}</p>
                    <p>Revenue Pulse: $${monthData.amount.toLocaleString()}</p>
                    <p>Order Frequency: ${monthData.orders}</p>
                `;
            }
        }
    });
}

// Function for what-if analysis
function setupWhatIf() {
    const slider = document.getElementById('growthSlider');
    const percentSpan = document.getElementById('growthPercent');
    const projectedSpan = document.getElementById('projectedAmount');
    
    if (!slider) return;
    
    slider.addEventListener('input', (e) => {
        const percent = parseInt(e.target.value);
        if (percentSpan) percentSpan.textContent = percent;
        
        const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
        const projected = totalSales * (1 + percent / 100);
        if (projectedSpan) projectedSpan.textContent = `$${projected.toLocaleString()}`;
    });
}

// Function to load monthly report table
function loadMonthlyReport() {
    const tbody = document.getElementById('monthlyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    salesData.forEach((item, index) => {
        const row = tbody.insertRow();
        const prevAmount = index > 0 ? salesData[index-1].amount : item.amount;
        const growth = ((item.amount - prevAmount) / prevAmount * 100).toFixed(1);
        const growthClass = growth >= 0 ? 'up' : 'down';
        const growthSymbol = growth >= 0 ? '▲' : '▼';
        
        row.innerHTML = `
            <td>${item.month}</td>
            <td>$${item.amount.toLocaleString()}</td>
            <td>${item.orders}</td>
            <td>$${Math.round(item.amount / item.orders).toLocaleString()}</td>
            <td style="color: ${growth >= 0 ? '#10b981' : '#ef4444'}">${growthSymbol} ${Math.abs(growth)}%</td>
        `;
    });
    
    renderBarChart('comparisonChart', salesData, 'amount', 'month');
}

// Function to load products table
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    productsData.forEach(product => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.rank}</td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>$${product.sales.toLocaleString()}</td>
            <td>${product.units}</td>
            <td>${product.contribution}</td>
        `;
    });
    
    renderBarChart('productChart', productsData, 'sales', 'name');
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateKPIs();
    renderBarChart('barChart', salesData, 'amount', 'month');
    setupFilter();
    setupWhatIf();
    loadMonthlyReport();
    loadProducts();
});
