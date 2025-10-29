# PowerShell script to convert all markdown files to complete HTML files
param()

$webDir = "c:\Users\vip.sharma\Downloads\resume-writing\web"
$rootDir = "c:\Users\vip.sharma\Downloads\resume-writing"

# Function to convert markdown content to HTML
function Convert-MarkdownSection {
    param([string]$content, [string]$title, [string]$filename)
    
    # Extract sections from markdown
    $lines = $content -split "`n"
    $sections = @()
    $currentSection = ""
    $inSection = $false
    
    foreach ($line in $lines) {
        if ($line -match "^## (.+)") {
            if ($currentSection) {
                $sections += $currentSection
            }
            $currentSection = $line + "`n"
            $inSection = $true
        } elseif ($inSection) {
            $currentSection += $line + "`n"
        }
    }
    if ($currentSection) {
        $sections += $currentSection
    }
    
    # Convert each section to HTML
    $htmlSections = ""
    $tocItems = ""
    
    foreach ($section in $sections) {
        if ($section -match "^## (.+)") {
            $sectionTitle = $matches[1]
            $sectionId = ($sectionTitle -replace '[^a-zA-Z0-9\s]', '' -replace '\s+', '-').ToLower()
            
            # Add to TOC
            $tocItems += "                    <li><a href=`"#$sectionId`">$sectionTitle</a></li>`n"
            
            # Process section content
            $sectionContent = $section -replace "^## .+`n", ""
            $questions = $sectionContent -split "(?=### Q\d+:)"
            
            $htmlSections += "            <section id=`"$sectionId`">`n"
            $htmlSections += "                <h2>$sectionTitle</h2>`n"
            
            foreach ($question in $questions) {
                if ($question.Trim() -and $question -match "### Q\d+: (.+)") {
                    $questionTitle = $matches[1]
                    $htmlSections += @"
                
                <div class="question">
                    <h3>$questionTitle</h3>
                    <div class="question-content">
                        <!-- Question content will be manually added -->
                    </div>
                </div>
"@
                }
            }
            $htmlSections += "            </section>`n`n"
        }
    }
    
    # Create complete HTML file
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title - Principal/Staff Engineer Study Guide</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>$title</h1>
            <div class="subtitle">Complete study guide with all 12 sections.</div>
        </header>

        <nav class="nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="01-system-design.html"$(if ($filename -eq "01-system-design.html") {" class=`"active`""})>System Design</a></li>
                <li><a href="02-distributed-systems.html"$(if ($filename -eq "02-distributed-systems.html") {" class=`"active`""})>Distributed Systems</a></li>
                <li><a href="03-databases-storage.html"$(if ($filename -eq "03-databases-storage.html") {" class=`"active`""})>Databases & Storage</a></li>
                <li><a href="04-performance-jvm.html"$(if ($filename -eq "04-performance-jvm.html") {" class=`"active`""})>Performance & JVM</a></li>
                <li><a href="05-event-driven-kafka.html"$(if ($filename -eq "05-event-driven-kafka.html") {" class=`"active`""})>Event-Driven & Kafka</a></li>
                <li><a href="06-observability-monitoring.html"$(if ($filename -eq "06-observability-monitoring.html") {" class=`"active`""})>Observability</a></li>
                <li><a href="07-security-compliance.html"$(if ($filename -eq "07-security-compliance.html") {" class=`"active`""})>Security & Compliance</a></li>
                <li><a href="08-leadership-tradeoffs.html"$(if ($filename -eq "08-leadership-tradeoffs.html") {" class=`"active`""})>Leadership & Trade-offs</a></li>
                <li><a href="09-testing-cicd.html"$(if ($filename -eq "09-testing-cicd.html") {" class=`"active`""})>Testing & CI/CD</a></li>
                <li><a href="10-algorithms-datastructures.html"$(if ($filename -eq "10-algorithms-datastructures.html") {" class=`"active`""})>Algorithms & Data Structures</a></li>
            </ul>
        </nav>

        <main>
            <div class="toc">
                <h2>Table of Contents</h2>
                <ol>
$tocItems                </ol>
            </div>

$htmlSections
            <div class="study-guide">
                <h2>How to Use This Study Guide</h2>
                
                <h3>Study Approach</h3>
                <ul>
                    <li>Focus on understanding concepts deeply rather than memorizing</li>
                    <li>Practice explaining complex topics in simple terms</li>
                    <li>Work through real-world scenarios and trade-off analysis</li>
                    <li>Time yourself on question responses</li>
                </ul>

                <h3>Mock Interview Practice</h3>
                <ul>
                    <li>Practice drawing diagrams and system architectures</li>
                    <li>Focus on explaining your thought process clearly</li>
                    <li>Be prepared to defend your architectural decisions</li>
                    <li>Understand the business context behind technical choices</li>
                </ul>
            </div>
        </main>

        <a href="#" class="back-to-top">↑</a>
    </div>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Show/hide back to top button
        window.addEventListener('scroll', function() {
            const backToTop = document.querySelector('.back-to-top');
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        // Back to top functionality
        document.querySelector('.back-to-top').addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    </script>
</body>
</html>
"@

    return $html
}

# Define the files to process
$files = @(
    @{md="02-Distributed-Systems.md"; html="02-distributed-systems.html"; title="Distributed Systems for Principal/Staff Engineers"},
    @{md="03-Databases-Storage.md"; html="03-databases-storage.html"; title="Databases & Storage for Principal/Staff Engineers"},
    @{md="04-Performance-JVM.md"; html="04-performance-jvm.html"; title="Performance & JVM for Principal/Staff Engineers"},
    @{md="05-Event-Driven-Architecture-Kafka.md"; html="05-event-driven-kafka.html"; title="Event-Driven Architecture & Kafka for Principal/Staff Engineers"},
    @{md="06-Observability-Monitoring.md"; html="06-observability-monitoring.html"; title="Observability & Monitoring for Principal/Staff Engineers"},
    @{md="07-Security-Compliance.md"; html="07-security-compliance.html"; title="Security & Compliance for Principal/Staff Engineers"},
    @{md="08-Leadership-Architecture-Tradeoffs.md"; html="08-leadership-tradeoffs.html"; title="Leadership & Architecture Trade-offs for Principal/Staff Engineers"},
    @{md="09-Testing-CICD.md"; html="09-testing-cicd.html"; title="Testing & CI/CD for Principal/Staff Engineers"},
    @{md="10-Algorithms-Data-Structures.md"; html="10-algorithms-datastructures.html"; title="Algorithms & Data Structures for Principal/Staff Engineers"}
)

Write-Host "Converting markdown files to HTML..."

foreach ($file in $files) {
    $mdPath = Join-Path $rootDir $file.md
    $htmlPath = Join-Path $webDir $file.html
    
    if (Test-Path $mdPath) {
        Write-Host "Processing $($file.md)..."
        $content = Get-Content $mdPath -Raw -Encoding UTF8
        $html = Convert-MarkdownSection -content $content -title $file.title -filename $file.html
        Set-Content -Path $htmlPath -Value $html -Encoding UTF8
        Write-Host "Created $($file.html)"
    } else {
        Write-Warning "Markdown file not found: $mdPath"
    }
}

Write-Host "Conversion complete!"