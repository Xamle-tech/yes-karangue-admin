import { useState } from 'react';
import { X, Printer, Download } from 'lucide-react';

export default function RouteSheetModal({ shipment, onClose, onPrint }) {
  const [stampConfirmed, setStampConfirmed] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
      <head>
        <title>Feuille de Route - ${shipment.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #305669; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #305669; }
          .company { font-size: 12px; color: #666; margin-top: 5px; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #305669; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; }
          .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px; }
          .field { display: grid; grid-template-columns: 150px 1fr; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .status-box { background: #f0f7ff; border: 2px solid #305669; padding: 15px; border-radius: 8px; text-align: center; }
          .status-value { font-size: 18px; font-weight: bold; color: #305669; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 11px; }
          .signature { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
          .signature-line { border-top: 1px solid #333; text-align: center; padding-top: 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🚚 YES KARANGUE</div>
          <div class="company">Feuille de Route de Livraison</div>
        </div>

        <div class="section">
          <div class="section-title">Informations du Colis</div>
          <div class="row">
            <div class="field">
              <div class="label">ID de Suivi:</div>
              <div class="value">${shipment.id}</div>
            </div>
            <div class="field">
              <div class="label">Numéro de Route:</div>
              <div class="value">${shipment.trackingNumber}</div>
            </div>
          </div>
          <div class="row">
            <div class="field">
              <div class="label">Description:</div>
              <div class="value">${shipment.description}</div>
            </div>
            <div class="field">
              <div class="label">Poids:</div>
              <div class="value">${shipment.weight} kg</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Trajet</div>
          <div class="row">
            <div class="field">
              <div class="label">Point de Départ:</div>
              <div class="value">${shipment.origin}</div>
            </div>
            <div class="field">
              <div class="label">Destination:</div>
              <div class="value">${shipment.destination}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Parties Concernées</div>
          <div class="row">
            <div class="field">
              <div class="label">Expéditeur:</div>
              <div class="value">${shipment.shipper}</div>
            </div>
            <div class="field">
              <div class="label">Destinataire:</div>
              <div class="value">${shipment.recipient}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Frais de Timbre</div>
          <div class="status-box">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Montant à payer</div>
            <div class="status-value">${shipment.stampFee.toLocaleString()} FCFA</div>
            <div style="font-size: 11px; color: #999; margin-top: 5px;">Timbre: ${
              stampConfirmed ? 'Confirmé' : 'En attente'
            }</div>
          </div>
        </div>

        <div class="signature">
          <div class="signature-line">Signature de l'Expéditeur</div>
          <div class="signature-line">Signature du Transporteur</div>
        </div>

        <div class="footer">
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>www.yeskarangue.com</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 100);
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download using a library like jsPDF
    alert('Téléchargement PDF - À implémenter avec une bibliothèque PDF');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Feuille de Route - {shipment.id}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-[#305669] pb-6">
            <h1 className="text-2xl font-bold text-[#305669]">YES KARANGUE</h1>
            <p className="text-sm text-gray-600 mt-1">Feuille de Route de Livraison</p>
          </div>

          {/* Shipment Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#305669] border-b border-gray-200 pb-2 mb-3">
                Informations du Colis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">ID de Suivi</p>
                  <p className="font-semibold text-gray-900">{shipment.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Numéro de Route</p>
                  <p className="font-semibold text-gray-900">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Description</p>
                  <p className="font-semibold text-gray-900">{shipment.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Poids</p>
                  <p className="font-semibold text-gray-900">{shipment.weight} kg</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#305669] border-b border-gray-200 pb-2 mb-3">
                Trajet
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Point de Départ</p>
                  <p className="font-semibold text-gray-900">{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Destination</p>
                  <p className="font-semibold text-gray-900">{shipment.destination}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#305669] border-b border-gray-200 pb-2 mb-3">
                Parties Concernées
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Expéditeur</p>
                  <p className="font-semibold text-gray-900">{shipment.shipper}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Destinataire</p>
                  <p className="font-semibold text-gray-900">{shipment.recipient}</p>
                </div>
              </div>
            </div>

            {/* Stamp Fee */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-[#305669] rounded-lg p-4">
              <p className="text-xs text-gray-700 mb-2">Frais de Timbre</p>
              <p className="text-3xl font-bold text-[#305669]">
                {shipment.stampFee.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Statut: <span className="font-semibold">En attente de confirmation</span>
              </p>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-t-2 border-gray-900 pt-4 text-center text-xs">
                <p>Signature de l'Expéditeur</p>
              </div>
              <div className="border-t-2 border-gray-900 pt-4 text-center text-xs">
                <p>Signature du Transporteur</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={stampConfirmed}
              onChange={(e) => setStampConfirmed(e.target.checked)}
              className="w-4 h-4 text-[#305669] rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-900">
              Confirmer le paiement du timbre ({shipment.stampFee.toLocaleString()} FCFA)
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-[#305669] text-white rounded-lg font-medium hover:bg-[#1F3A4A] transition"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

