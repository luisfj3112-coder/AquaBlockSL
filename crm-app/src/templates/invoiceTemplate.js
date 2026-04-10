export const invoiceTemplate = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Factura</title>
		<style>
            body { font-family: sans-serif; font-size: 14px; margin: 40px; }
            .pdf24_02 { position: relative; width: 100%; max-width: 800px; height: 1000px; border: 1px solid #eee; padding: 20px; }
            .pdf24_01 { position: absolute; white-space: nowrap; }
            .pdf24_12 { font-weight: bold; font-size: 1.1em; color: #333; }
		</style>
	</head>
	<body>
		<div class="pdf24_02">
            <div class="pdf24_01" style="left:5.7666em;top:16.8086em;">Nombre: {{NOMBRE}}</div>
            <div class="pdf24_01" style="left:5.7666em;top:17.934em;">DNI: {{DNI}}</div>
            <div class="pdf24_01" style="left:29.8116em;top:15.4782em;"><span class="pdf24_12">FACTURA Nº: {{NUM_FACTURA}}</span></div>
            <div class="pdf24_01" style="left:28.8631em;top:16.7669em;">FECHA FACTURA: {{FECHA}}</div>
            <div class="pdf24_01" style="left:5.7666em;top:19.0595em;">Dirección: {{DIRECCION}}</div>
            <div class="pdf24_01" style="left:5.7666em;top:20.1849em;">{{CP_POBLACION}}</div>
            
            <div class="pdf24_01" style="left:6.7466em;top:24.9667em;">{{ITEM_1_DESC}}</div>
            <div class="pdf24_01" style="left:25.8211em;top:24.9667em;">{{ITEM_1_PRECIO}} €</div>
            <div class="pdf24_01" style="left:34.4096em;top:24.9667em;">{{ITEM_1_CANT}}</div>
            <div class="pdf24_01" style="left:39.4948em;top:24.9667em;">{{ITEM_1_TOTAL}} €</div>
            
            <div class="pdf24_01" style="left:34.2161em;top:39.9019em;"><span class="pdf24_12">TOTAL:</span></div>
            <div class="pdf24_01" style="left:40.9478em;top:39.9015em;"><span class="pdf24_12">{{TOTAL}} €</span></div>
		</div>
	</body>
</html>`;
