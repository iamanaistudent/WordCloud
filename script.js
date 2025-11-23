// Word Cloud Generator JavaScript
class WordCloudGenerator {
    constructor() {
        this.textInput = document.getElementById('text-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.outputContainer = document.getElementById('word-cloud-output');
        
        this.init();
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generateWordCloud());
        this.textInput.addEventListener('input', () => this.handleTextInput());
        
        // Add some sample text for demonstration
        this.addSampleText();
    }
    
    addSampleText() {
        const sampleText = `Welcome to our amazing word cloud generator! This tool helps you create beautiful visual representations of your text. Simply paste your content and watch as we transform it into an engaging word cloud. The more frequently a word appears, the larger it will be displayed. You can use this for presentations, content analysis, education, and much more. Try it out with your own text and see the magic happen!`;
        this.textInput.value = sampleText;
    }
    
    handleTextInput() {
        const text = this.textInput.value.trim();
        if (text.length > 0) {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Word Cloud';
        } else {
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = 'Enter text first';
        }
    }
    
    generateWordCloud() {
        const text = this.textInput.value.trim();
        if (!text) return;
        
        // Show loading state
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;
        
        // Process the text and create word cloud
        setTimeout(() => {
            const wordCloud = this.processText(text);
            this.displayWordCloud(wordCloud);
            
            // Reset button
            this.generateBtn.textContent = 'Generate Word Cloud';
            this.generateBtn.disabled = false;
        }, 500);
    }
    
    processText(text) {
        // Clean and normalize text
        const cleanedText = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove punctuation
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        // Split into words and filter out common stop words
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
            'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
        ]);
        
        const words = cleanedText.split(' ')
            .filter(word => word.length > 2 && !stopWords.has(word))
            .filter(word => /^[a-zA-Z]+$/.test(word)); // Only alphabetic words
        
        // Count word frequencies
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        
        // Sort by frequency and get top words
        const sortedWords = Object.entries(wordCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 30) // Limit to top 30 words
            .map(([word, count]) => ({ word, count }));
        
        return sortedWords;
    }
    
    displayWordCloud(wordCloud) {
        if (wordCloud.length === 0) {
            this.outputContainer.innerHTML = '<p class="placeholder-text">No words found to display. Try adding more text!</p>';
            return;
        }
        
        // Clear previous content
        this.outputContainer.innerHTML = '';
        
        // Find max and min counts for scaling
        const maxCount = Math.max(...wordCloud.map(item => item.count));
        const minCount = Math.min(...wordCloud.map(item => item.count));
        
        // Color palette
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
            '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
            '#d299c2', '#fef9d7', '#667eea', '#764ba2'
        ];
        
        // Create word elements
        wordCloud.forEach((item, index) => {
            const wordElement = document.createElement('span');
            wordElement.textContent = item.word;
            wordElement.className = 'cloud-word';
            
            // Calculate font size based on frequency (scaled between 1rem and 3rem)
            const sizeRatio = (item.count - minCount) / (maxCount - minCount);
            const fontSize = 1 + (sizeRatio * 2); // 1rem to 3rem
            wordElement.style.fontSize = `${fontSize}rem`;
            
            // Assign color
            wordElement.style.color = colors[index % colors.length];
            
            // Add hover effect
            wordElement.style.cursor = 'pointer';
            wordElement.title = `"${item.word}" appears ${item.count} time${item.count > 1 ? 's' : ''}`;
            
            // Add click handler for interaction
            wordElement.addEventListener('click', () => {
                this.highlightWord(item.word, item.count);
            });
            
            // Add animation delay for staggered appearance
            wordElement.style.animationDelay = `${index * 0.1}s`;
            
            this.outputContainer.appendChild(wordElement);
        });
        
        // Add CSS for word cloud animation
        this.addWordCloudStyles();
    }
    
    addWordCloudStyles() {
        if (document.getElementById('word-cloud-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'word-cloud-styles';
        style.textContent = `
            .cloud-word {
                display: inline-block;
                margin: 5px 8px;
                padding: 5px 10px;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                animation: fadeInScale 0.6s ease forwards;
                opacity: 0;
                transform: scale(0.8);
            }
            
            .cloud-word:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 10;
                position: relative;
            }
            
            @keyframes fadeInScale {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    highlightWord(word, count) {
        // Create a temporary highlight effect
        const wordElements = this.outputContainer.querySelectorAll('.cloud-word');
        wordElements.forEach(element => {
            if (element.textContent === word) {
                element.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
                element.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    element.style.backgroundColor = '';
                    element.style.transform = '';
                }, 2000);
            }
        });
        
        // Show word info
        this.showWordInfo(word, count);
    }
    
    showWordInfo(word, count) {
        // Create or update info display
        let infoElement = document.getElementById('word-info');
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.id = 'word-info';
            infoElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-size: 1rem;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(infoElement);
        }
        
        infoElement.textContent = `"${word}" appears ${count} time${count > 1 ? 's' : ''}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (infoElement) {
                infoElement.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (infoElement.parentNode) {
                        infoElement.parentNode.removeChild(infoElement);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Add additional CSS for animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Initialize the word cloud generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordCloudGenerator();
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .step, .use-case').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
