"use client";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700">
            By accessing and using ExpertInTheCity, you agree to be bound by
            these Terms of Service and all applicable laws and regulations. If
            you do not agree with any of these terms, you are prohibited from
            using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use ExpertInTheCity for
            personal, non-commercial purposes. This license does not include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for commercial purposes</li>
            <li>Attempting to reverse engineer any software</li>
            <li>Removing any copyright or proprietary notations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            As a user of ExpertInTheCity, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not engage in any fraudulent or illegal activities</li>
            <li>Respect the rights of other users</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Service Modifications
          </h2>
          <p className="text-gray-700">
            ExpertInTheCity reserves the right to modify or discontinue,
            temporarily or permanently, the service with or without notice. We
            shall not be liable to you or any third party for any modification,
            suspension, or discontinuance of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700">
            In no event shall ExpertInTheCity be liable for any damages arising
            out of the use or inability to use the materials on our website,
            even if we have been notified of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
          <p className="text-gray-700">
            These terms and conditions are governed by and construed in
            accordance with the laws of your jurisdiction and you irrevocably
            submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Contact Information
          </h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please
            contact us at:
            <br />
            Email: legal@expertinthecity.com
          </p>
        </section>
      </div>
    </div>
  );
}
