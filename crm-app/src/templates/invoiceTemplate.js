export const invoiceTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:ital,wght@0,400;0,700;1,700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; }
        .pdf24_ { position: relative; width: 49.58333em; height: 70.16666em; margin: 0 auto; overflow: hidden; background: white; }
        .pdf24_01 { position: absolute; white-space: nowrap; }
        .pdf24_11 { line-height: 1.44em; }
        .pdf24_12 { font-family: 'Open Sans', sans-serif; font-weight: 700; font-size: 0.833em; color: #0A0809; }
        .pdf24_13 { letter-spacing: 0.1em; }
        .pdf24_14 { font-family: 'Open Sans', sans-serif; font-weight: 500; font-size: 0.833em; }
        .pdf24_15 { font-family: 'Open Sans', sans-serif; font-weight: 400; font-size: 0.833em; }
        .pdf24_07 { font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 1.315em; color: #0A0809; }
    </style>
</head>
<body>
    <div class="pdf24_">
        <!-- Logo / Cabecera -->
        <div class="pdf24_01 pdf24_07" style="left:2.58em;top:2.79em;">SOLUCIONES AQ</div>
        
        <!-- Bloque Cliente -->
        <div class="pdf24_01 pdf24_15" style="left:5.76em;top:16.80em;">Nombre: {{NOMBRE}}</div>
        <div class="pdf24_01 pdf24_15" style="left:5.76em;top:17.93em;">DNI: {{DNI}}</div>
        <div class="pdf24_01 pdf24_15" style="left:5.76em;top:19.05em;">Dirección: {{DIRECCION}}</div>
        <div class="pdf24_01 pdf24_15" style="left:5.76em;top:20.18em;">{{CP_POBLACION}}</div>

        <!-- Bloque Factura -->
        <div class="pdf24_01 pdf24_12 pdf24_13" style="left:29.81em;top:15.47em;">FACTURA Nº: {{NUM_FACTURA}}</div>
        <div class="pdf24_01 pdf24_15" style="left:28.86em;top:16.76em;">FECHA: {{FECHA}}</div>

        <!-- Encabezados Tabla -->
        <div class="pdf24_01 pdf24_12" style="left:6.40em;top:21.94em;">DESCRIPCIÓN</div>
        <div class="pdf24_01 pdf24_12" style="left:25.33em;top:21.94em;">PRECIO UNIDAD</div>
        <div class="pdf24_01 pdf24_12" style="left:32.92em;top:21.94em;">CANT.</div>
        <div class="pdf24_01 pdf24_12" style="left:40.21em;top:21.94em;">TOTAL</div>

        <!-- El contenido de los artículos se inyectará aquí -->
        {{ITEMS_ROWS}}

        <!-- Totales -->
        <div class="pdf24_01 pdf24_12" style="left:6.40em;top:32.09em;">SUBTOTAL</div>
        <div class="pdf24_01 pdf24_12" style="left:39.67em;top:32.09em;">{{SUBTOTAL}} €</div>
        
        <div class="pdf24_01 pdf24_12" style="left:34.21em;top:39.90em;">TOTAL</div>
        <div class="pdf24_01 pdf24_12" style="left:40.94em;top:39.90em;">{{TOTAL}} €</div>
    </div>
</body>
</html>`;
