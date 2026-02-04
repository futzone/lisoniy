# PowerShell script to replace Sparkles icon with lisoniy_small.png logo across all pages

$files = @(
    'lisoniy_app\src\pages\tools\TransliterationPage.tsx',
    'lisoniy_app\src\pages\tools\ToolLandingPage.tsx',
    'lisoniy_app\src\pages\docs\GuidelinesPage.tsx',
    'lisoniy_app\src\pages\docs\OpenSourcePage.tsx',
    'lisoniy_app\src\pages\dashboard\ProfilePage.tsx',
    'lisoniy_app\src\pages\dashboard\MyContributionsPage.tsx',
    'lisoniy_app\src\pages\dashboard\LeaderboardPage.tsx',
    'lisoniy_app\src\pages\dashboard\ExploreDatasetsPage.tsx',
    'lisoniy_app\src\app\components\layout\Footer.tsx'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace the Sparkles icon div with logo img
        $content = $content -replace '<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">\s*<Sparkles className="h-5 w-5" />\s*</div>', '<img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-8 w-8 object-cover rounded-lg" />'
        
        # Save the file
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Logo replacement complete!"
