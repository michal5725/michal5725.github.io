<?php
/** @var string $input */
/** @var string $inputFormat */
/** @var string $outputFormat */
/** @var string $output */
/** @var string|null $error */
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
</head>
<body>
<h1>Konwerter CSV / JSON / YAML</h1>

<?php if (!empty($error)): ?>
    <p style="color: red;"><?= htmlspecialchars($error) ?></p>
<?php endif; ?>

<form method="post">
    <p>
        <label>Dane wejściowe:</label><br>
        <textarea name="input" rows="10" cols="80"><?= htmlspecialchars($input) ?></textarea>
    </p>

    <p>
        <label>Format wejściowy:
            <select name="input_format">
                <option value="csv"  <?= $inputFormat === 'csv'  ? 'selected' : '' ?>>CSV (przecinek)</option>
                <option value="ssv"  <?= $inputFormat === 'ssv'  ? 'selected' : '' ?>>SSV (średnik)</option>
                <option value="tsv"  <?= $inputFormat === 'tsv'  ? 'selected' : '' ?>>TSV (tabulator)</option>
                <option value="json" <?= $inputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yaml" <?= $inputFormat === 'yaml' ? 'selected' : '' ?>>YAML</option>
            </select>
        </label>
    </p>

    <p>
        <label>Format wyjściowy:
            <select name="output_format">
                <option value="csv"  <?= $outputFormat === 'csv'  ? 'selected' : '' ?>>CSV (przecinek)</option>
                <option value="ssv"  <?= $outputFormat === 'ssv'  ? 'selected' : '' ?>>SSV (średnik)</option>
                <option value="tsv"  <?= $outputFormat === 'tsv'  ? 'selected' : '' ?>>TSV (tabulator)</option>
                <option value="json" <?= $outputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yaml" <?= $outputFormat === 'yaml' ? 'selected' : '' ?>>YAML</option>
            </select>
        </label>
    </p>

    <p>
        <button type="submit">Konwertuj</button>
    </p>
</form>

<hr>

<h2>Wynik:</h2>
<pre><?= htmlspecialchars($output) ?></pre>
</body>
</html>
