import React, { useState, useEffect } from "react";

// Definisikan tipe Props
interface Props {
  campaign: any; // Ganti dengan tipe yang sesuai jika ada
  banks: any;
}

const DonationForm: React.FC<Props> = ({ campaign, banks }) => {
  const [step, setStep] = useState(1);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState("");
  const [fbTracked, setFbTracked] = useState(false);

  const campaignSlug = campaign.slug;

  useEffect(() => {
    if (anonymous) {
      setDonorName("Anonim");
    } else {
      setDonorName("");
    }
  }, [anonymous]);

  useEffect(() => {
    if (!fbTracked) {
      fbTrack("Lead", {
        content_name: campaign.title,
        content_ids: [campaignSlug],
        value: parseFloat(amount),
        currency: "IDR",
      });
      setFbTracked(true);
    }
  }, [fbTracked, amount, campaign.title, campaignSlug]);

  const handleAmountClick = (value: any) => {
    setAmount(value);
  };

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const handleFileChange = (e: any) => {
    setProofFile(e.target.files[0]);
  };

  // Validasi Step 1
  const validateStep1 = () => {
    if (!donorName || !amount || !selectedBank) {
      alert("Semua field di Step 1 harus diisi!");
      return false;
    }
    return true;
  };

  // Validasi Step 2
  const validateStep2 = () => {
    if (!proofFile) {
      alert("Bukti transfer harus diunggah!");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("slug", campaignSlug);
      formData.append("amount", amount);
      formData.append("notes", message); // Add the message to the form data
      formData.append("payment_method", "manual_transfer");
      formData.append("bank_account", selectedBank);

      if (proofFile) {
        formData.append("payment_proof", proofFile);
      }

      const response = await fetch(`https://sys.yathim.or.id/api/donation`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStep(3);
      } else {
        throw new Error("Donation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim donasi. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center font-semibold md:text-4xl text-2xl mb-6 border-b pb-5 shadow-md rounded-lg">
        Form Donasi
      </div>
      {/* Stepper Indicator */}
      <div className="flex justify-between mb-6">
        <div
          className={`w-1/3 text-center py-2 rounded-full ${
            step === 1
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Step 1
        </div>
        <div
          className={`w-1/3 text-center py-2 rounded-full ${
            step === 2
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Step 2
        </div>
        <div
          className={`w-1/3 text-center py-2 rounded-full ${
            step === 3
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Step 3
        </div>
      </div>

      {/* Step 1: Donor Info */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateStep1()) {
              setStep(2);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Donatur
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              disabled={anonymous}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
              className="h-4 w-4 text-primary-600"
            />
            <label className="text-sm text-gray-700">
              Donasi sebagai Anonim
            </label>
          </div>

          {/* Donation Amount Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["50000", "100000", "250000", "500000"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAmountClick(value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-primary-50 hover:border-primary-300 focus:outline-none"
              >
                Rp {value}
              </button>
            ))}
          </div>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Atau masukkan jumlah lain"
              min="10000"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Select Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tujuan Transfer
            </label>
            <select
              id="bank"
              name="bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Pilih Bank</option>
              {banks &&
                Array.isArray(banks.data) &&
                banks.data.map((bank: any) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}{" "}
                    {bank.name === "QRIS" ? "" : ` - ${bank.account_number}`}
                  </option>
                ))}
            </select>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesan (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tuliskan pesan Anda jika ada..."
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Lanjutkan ke Konfirmasi
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Confirm Details */}
      {step === 2 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">
            Ringkasan Donasi
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between text-sm text-gray-600">
              <span>Nama:</span>
              <span>{donorName || "Anonim"}</span>
            </p>
            <p className="flex justify-between text-sm text-gray-600">
              <span>Jumlah:</span>
              <span className="font-bold">Rp {amount}</span>
            </p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Bank:</span>
              {/* Tampilkan detail bank berdasarkan ID yang dipilih */}
              {banks && Array.isArray(banks.data) && selectedBank
                ? banks.data
                    .filter((bank: any) => bank.id === parseInt(selectedBank))
                    .map((selectedBankData: any) => (
                      <div
                        key={selectedBankData.id}
                        className="text-right font-bold"
                      >
                        <span>{selectedBankData.name}</span>
                        <br />
                        {selectedBankData.name !== "QRIS" && (
                          <>
                            <span>{selectedBankData.account_number}</span>
                            <button
                              type="button"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  selectedBankData.account_number
                                )
                              }
                              className="ml-2 text-sm text-white hover:bg-green-500 bg-green-600 p-1 rounded-md"
                            >
                              Copy
                            </button>
                          </>
                        )}
                        <br />
                        <span>{selectedBankData.account_holder}</span>
                        {/* Menampilkan logo QRIS jika dipilih */}
                        {selectedBankData.name === "QRIS" &&
                          selectedBankData.logo && (
                            <div className="my-2">
                              <img
                                src={`https://sys.yathim.or.id/storage/${selectedBankData.logo}`}
                                alt="QRIS Logo"
                                className="h-200 w-full object-contain"
                              />
                            </div>
                          )}
                      </div>
                    ))
                : null}
            </div>
            {message && (
              <p className="flex justify-between text-sm text-gray-600">
                <span>Pesan:</span>
                <span>{message}</span>
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validateStep2()) {
                handleFormSubmit(e);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Bukti Transfer
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Kembali
              </button>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Kirim Donasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Success Message */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Donasi Berhasil Dikirim!
          </h4>
          <p className="text-gray-600 text-sm">
            Terima kasih atas donasi Anda. Tim kami akan segera memverifikasi
            pembayaran.
          </p>
        </div>
      )}
    </div>
  );
};

// FB tracking function
function fbTrack(eventName: any, eventData: any) {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, eventData);
  } else {
    console.warn("FB Tracking is not available");
  }
}

export default DonationForm;
