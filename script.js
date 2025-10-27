// London Uber Driver Earnings Calculator
// Main JavaScript file

console.log('London Uber Driver Earnings Calculator loaded');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    console.log('App initialized');
    
    // Get form elements
    const form = document.getElementById('earningsForm');
    const hoursSlider = document.getElementById('hours');
    const hoursValue = document.getElementById('hoursValue');
    const resultArea = document.getElementById('resultArea');
    
    // Update slider value display
    hoursSlider.addEventListener('input', function() {
        hoursValue.textContent = `${this.value} hours`;
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateEarnings();
    });
    
    function calculateEarnings() {
        // Get all form values with validation
        const hours = parseInt(hoursSlider.value);
        
        // Security: Validate hours input
        if (isNaN(hours) || hours < 20 || hours > 90) {
            resultArea.innerHTML = '<p style="color: #dc3545;">Please select valid hours (20-90)</p>';
            return;
        }
        
        // Get work times (checkboxes) with validation
        const workTimes = [];
        const workTimeCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        workTimeCheckboxes.forEach(checkbox => {
            const value = parseFloat(checkbox.value);
            // Security: Validate multiplier values
            if (!isNaN(value) && value >= 0.5 && value <= 2.0) {
                workTimes.push(value);
            }
        });
        
        // Calculate average work time multiplier
        const workTimeMultiplier = workTimes.length > 0 
            ? workTimes.reduce((sum, val) => sum + val, 0) / workTimes.length 
            : 1.0;
        
        // Get weekend work with validation
        const weekendRadio = document.querySelector('input[name="weekend"]:checked');
        if (!weekendRadio) {
            resultArea.innerHTML = '<p style="color: #dc3545;">Please select weekend work option</p>';
            return;
        }
        const weekendWork = weekendRadio.value === 'yes';
        const weekendMultiplier = weekendWork ? 1.1 : 1.0;
        
        // Get car category with validation
        const carRadio = document.querySelector('input[name="carCategory"]:checked');
        if (!carRadio) {
            resultArea.innerHTML = '<p style="color: #dc3545;">Please select a car category</p>';
            return;
        }
        const carCategory = carRadio.value;
        const carMultipliers = {
            normal: 1.0,
            executive: 1.25,
            seater: 1.2
        };
        const carCosts = {
            normal: 230,
            executive: 300,
            seater: 270
        };
        
        const carMultiplier = carMultipliers[carCategory];
        const vehicleCost = carCosts[carCategory];
        
        // Base rate
        const baseRate = 18; // £18/hour
        
        // Calculate gross earnings
        const grossHourly = baseRate * workTimeMultiplier * weekendMultiplier * carMultiplier;
        const grossWeekly = grossHourly * hours;
        
        // Calculate costs
        const fuelCost = 2.5 * hours; // £2.50 per hour
        const otherCosts = 40; // £40/week for cleaning, parking, data
        const totalWeeklyCost = vehicleCost + fuelCost + otherCosts;
        
        // Calculate net earnings
        const netWeekly = grossWeekly - totalWeeklyCost;
        const netHourly = netWeekly / hours;
        const netMonthly = netWeekly * 4.33;
        
        // Round values
        const grossHourlyRounded = Math.round(grossHourly * 100) / 100;
        const grossWeeklyRounded = Math.round(grossWeekly * 100) / 100;
        const netWeeklyRounded = Math.round(netWeekly * 100) / 100;
        const netHourlyRounded = Math.round(netHourly * 100) / 100;
        const netMonthlyRounded = Math.round(netMonthly * 100) / 100;
        
        // Create share message
        const shareMessage = `I just estimated my London Uber driver earnings: £${netWeeklyRounded}/week after costs. Try it yourself: [link]`;
        const shareUrl = window.location.href;
        
        // Display results
        resultArea.innerHTML = `
            <div style="color: #28a745; font-weight: 600; font-size: 1.3rem; margin-bottom: 15px;">
                Your Earnings Estimate
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="color: #000; font-weight: 600; font-size: 1.1rem; margin-bottom: 10px;">
                    Gross Earnings: £${grossHourlyRounded}/hour (£${grossWeeklyRounded}/week)
                </div>
                <div style="color: #6c757d; font-size: 0.9rem; margin-bottom: 8px;">
                    Based on: ${hours} hours/week, ${getWorkTimeDescription(workTimeCheckboxes)}, ${weekendWork ? 'weekend work' : 'weekdays only'}, ${getCarDescription(carCategory)}
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <div style="color: #000; font-weight: 600; margin-bottom: 10px;">Weekly Costs:</div>
                <div style="color: #6c757d; font-size: 0.9rem; margin-bottom: 5px;">• Vehicle: £${vehicleCost}</div>
                <div style="color: #6c757d; font-size: 0.9rem; margin-bottom: 5px;">• Fuel: £${fuelCost.toFixed(2)}</div>
                <div style="color: #6c757d; font-size: 0.9rem; margin-bottom: 10px;">• Cleaning, parking & data: £${otherCosts}</div>
                <div style="color: #000; font-weight: 600; border-top: 1px solid #dee2e6; padding-top: 8px;">Total Weekly Costs: £${totalWeeklyCost.toFixed(2)}</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">Net Weekly: £${netWeeklyRounded}</div>
                <div style="font-size: 1rem; margin-bottom: 5px;">Net Hourly: £${netHourlyRounded}</div>
                <div style="font-size: 1rem;">Net Monthly: £${netMonthlyRounded}</div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="color: #000; font-weight: 600; margin-bottom: 15px; text-align: center;">Share Your Results</div>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="shareWhatsApp('${shareMessage}', '${shareUrl}')" class="share-btn whatsapp-btn" title="Share on WhatsApp">
                        📱
                    </button>
                    <button onclick="shareEmail('${shareMessage}', '${shareUrl}')" class="share-btn email-btn" title="Share via Email">
                        ✉️
                    </button>
                    <button onclick="copyLink('${shareUrl}')" class="share-btn copy-btn" title="Copy Link">
                        📋
                    </button>
                </div>
            </div>
        `;
        
        console.log(`Earnings calculated: £${netWeeklyRounded}/week net`);
    }
    
    // Helper function to get work time description
    function getWorkTimeDescription(checkboxes) {
        const selectedTimes = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.id === 'earlyMorning') selectedTimes.push('early mornings');
            if (checkbox.id === 'afternoon') selectedTimes.push('afternoons');
            if (checkbox.id === 'evening') selectedTimes.push('evenings');
            if (checkbox.id === 'lateNight') selectedTimes.push('late nights');
        });
        
        if (selectedTimes.length === 0) return 'no specific times';
        if (selectedTimes.length === 1) return selectedTimes[0];
        if (selectedTimes.length === 2) return selectedTimes.join(' & ');
        return selectedTimes.slice(0, -1).join(', ') + ' & ' + selectedTimes[selectedTimes.length - 1];
    }
    
    // Helper function to get car description
    function getCarDescription(category) {
        const descriptions = {
            normal: 'normal car',
            executive: 'executive car',
            seater: '7-seater car'
        };
        return descriptions[category] || 'normal car';
    }
}

// Share functions
function shareWhatsApp(message, url) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message.replace('[link]', url))}`;
    window.open(whatsappUrl, '_blank');
}

function shareEmail(message, url) {
    const subject = 'My London Uber Driver Earnings Estimate';
    const body = message.replace('[link]', url);
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(function() {
        // Show success message
        const copyBtn = event.target;
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied!';
        copyBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        alert('Could not copy link. Please copy manually: ' + url);
    });
}
