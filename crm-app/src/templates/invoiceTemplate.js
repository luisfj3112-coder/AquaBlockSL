export const invoiceTemplate = \`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; }
        .pdf24_ { position: relative; width: 49.58333em; height: 70.16666em; margin: 0 auto; background: white; }
        .pdf24_01 { position: absolute; white-space: nowrap; }
        .pdf24_logo { position: absolute; left: 2.5em; top: 2.5em; width: 14em; }
        .pdf24_header_bg { position: absolute; left: 4.5em; top: 21.4em; width: 40.5em; height: 1.5em; background-color: #B2B2B2; }
        .pdf24_footer_bg { position: absolute; left: 4.5em; top: 38.5em; width: 40.5em; height: 1.5em; background-color: #B2B2B2; }
        .pdf24_label { font-weight: 700; font-size: 0.85em; }
        .pdf24_text { font-size: 0.8em; color: #333; }
    </style>
</head>
<body>
    <div class="pdf24_">
        <img src="https://res.cloudinary.com/dub6p0jb9/image/upload/v1775907096/image_2_gyj90d.png" class="pdf24_logo" />
        
        <div class="pdf24_01 pdf24_label" style="left:5.76em;top:15.8em;">CLIENTE:</div>
        <div class="pdf24_01 pdf24_text" style="left:5.76em;top:16.8em;">Nombre: {{NOMBRE}}</div>
        <div class="pdf24_01 pdf24_text" style="left:5.76em;top:17.9em;">DNI: {{DNI}}</div>
        <div class="pdf24_01 pdf24_text" style="left:5.76em;top:19em;">Dirección: {{DIRECCION}}</div>
        <div class="pdf24_01 pdf24_text" style="left:5.76em;top:20.1em;">{{CP_POBLACION}}</div>

        <div class="pdf24_01 pdf24_label" style="left:28.81em;top:15.8em;">FACTURA Nº: {{NUM_FACTURA}}</div>
        <div class="pdf24_01 pdf24_text" style="left:28.81em;top:16.8em;">FECHA FACTURA: {{FECHA}}</div>

        <div class="pdf24_header_bg"></div>
        <div class="pdf24_01 pdf24_label" style="left:6.4em;top:21.8em;color:white;">DESCRIPCION</div>
        <div class="pdf24_01 pdf24_label" style="left:25.1em;top:21.8em;color:white;">PRECIO</div>
        <div class="pdf24_01 pdf24_label" style="left:33.2em;top:21.8em;color:white;">CANTIDAD</div>
        <div class="pdf24_01 pdf24_label" style="left:40.2em;top:21.8em;color:white;">TOTAL</div>

        {{ITEMS_ROWS}}

        <div class="pdf24_01 pdf24_label" style="left:6.4em;top:32.1em;">SUBTOTAL</div>
        <div class="pdf24_01 pdf24_text" style="left:39.7em;top:32.1em;">{{SUBTOTAL}} €</div>
        
        <div class="pdf24_footer_bg"></div>
        <div class="pdf24_01 pdf24_label" style="left:34.2em;top:38.8em;color:white;">TOTAL</div>
        <div class="pdf24_01 pdf24_label" style="left:40.9em;top:38.8em;color:white;">{{TOTAL}} €</div>

        <div class="pdf24_01" style="left:5.76em;top:45.5em;font-size:0.75em;font-weight:bold;">DATOS BANCARIOS:</div>
        <div class="pdf24_01" style="left:5.76em;top:46.8em;font-size:0.65em;">Banco Sabadell | Beneficiario: Aquablock Sistemas</div>
        <div class="pdf24_01" style="left:5.76em;top:47.8em;font-size:0.65em;">Cuenta: ES11 0081 5154 2100 0134 0937</div>
    </div>
</body>
</html>\`;