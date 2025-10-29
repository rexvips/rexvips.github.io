# Markdown to HTML Conversion Script for Study Guides

# Define file mappings
$files = @{
    "02-Distributed-Systems.md" = @{
        "html" = "02-distributed-systems.html"
        "title" = "Distributed Systems for Principal/Staff Engineers"
        "subtitle" = "Master consensus algorithms, coordination protocols, and distributed computing patterns essential for building resilient large-scale systems."
        "nav" = "Distributed Systems"
    }
    "03-Databases-Storage.md" = @{
        "html" = "03-databases-storage.html"
        "title" = "Databases & Storage for Principal/Staff Engineers"
        "subtitle" = "Master database internals, storage engines, transaction processing, and data modeling strategies for high-performance, scalable systems."
        "nav" = "Databases & Storage"
    }
    "04-Performance-JVM.md" = @{
        "html" = "04-performance-jvm.html"
        "title" = "Performance & JVM for Principal/Staff Engineers"
        "subtitle" = "Master JVM internals, garbage collection strategies, performance optimization, and concurrency patterns for building high-performance Java applications at scale."
        "nav" = "Performance & JVM"
    }
    "05-Event-Driven-Architecture-Kafka.md" = @{
        "html" = "05-event-driven-kafka.html"
        "title" = "Event-Driven Architecture & Kafka for Principal/Staff Engineers"
        "subtitle" = "Master event streaming, Kafka internals, and event-driven patterns for building scalable, resilient distributed systems with strong consistency and ordering guarantees."
        "nav" = "Event-Driven & Kafka"
    }
    "06-Observability-Monitoring.md" = @{
        "html" = "06-observability-monitoring.html"
        "title" = "Observability & Monitoring for Principal/Staff Engineers"
        "subtitle" = "Master distributed tracing, metrics design, alerting strategies, and observability practices for maintaining complex distributed systems at scale."
        "nav" = "Observability"
    }
    "07-Security-Compliance.md" = @{
        "html" = "07-security-compliance.html"
        "title" = "Security & Compliance for Principal/Staff Engineers"
        "subtitle" = "Master authentication, authorization, encryption, and compliance frameworks essential for building secure, auditable systems at enterprise scale."
        "nav" = "Security & Compliance"
    }
    "08-Leadership-Architecture-Tradeoffs.md" = @{
        "html" = "08-leadership-tradeoffs.html"
        "title" = "Leadership & Architecture Trade-offs for Principal/Staff Engineers"
        "subtitle" = "Master architectural decision-making, technical strategy, team coordination, and stakeholder alignment essential for senior engineering leadership roles."
        "nav" = "Leadership & Trade-offs"
    }
    "09-Testing-CICD.md" = @{
        "html" = "09-testing-cicd.html"
        "title" = "Testing & CI/CD for Principal/Staff Engineers"
        "subtitle" = "Master testing strategies, deployment pipelines, and delivery practices for reliable, fast software delivery in complex distributed systems at scale."
        "nav" = "Testing & CI/CD"
    }
    "10-Algorithms-Data-Structures.md" = @{
        "html" = "10-algorithms-datastructures.html"
        "title" = "Algorithms & Data Structures for Principal/Staff Engineers"
        "subtitle" = "Master algorithms and data structures with system-level impact focus, emphasizing concurrency-safe implementations, performance optimization, and distributed system applications."
        "nav" = "Algorithms & Data Structures"
    }
}

# Navigation template
$navTemplate = @"
        <nav class="nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="01-system-design.html">System Design</a></li>
                <li><a href="02-distributed-systems.html">Distributed Systems</a></li>
                <li><a href="03-databases-storage.html">Databases & Storage</a></li>
                <li><a href="04-performance-jvm.html">Performance & JVM</a></li>
                <li><a href="05-event-driven-kafka.html">Event-Driven & Kafka</a></li>
                <li><a href="06-observability-monitoring.html">Observability</a></li>
                <li><a href="07-security-compliance.html">Security & Compliance</a></li>
                <li><a href="08-leadership-tradeoffs.html">Leadership & Trade-offs</a></li>
                <li><a href="09-testing-cicd.html">Testing & CI/CD</a></li>
                <li><a href="10-algorithms-datastructures.html">Algorithms & Data Structures</a></li>
            </ul>
        </nav>
"@

Write-Host "Starting conversion of markdown files to HTML..."
Write-Host "Files to convert: $($files.Keys -join ', ')"

foreach ($mdFile in $files.Keys) {
    $fileInfo = $files[$mdFile]
    $mdPath = "c:\Users\vip.sharma\Downloads\resume-writing\$mdFile"
    $htmlPath = "c:\Users\vip.sharma\Downloads\resume-writing\web\$($fileInfo.html)"
    
    Write-Host "Processing $mdFile -> $($fileInfo.html)"
}

Write-Host "Conversion mapping prepared successfully!"