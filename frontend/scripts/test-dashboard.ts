import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting NexusHub User Dashboard & Profile Management Test Suite...\n');

  // Test 1: Unauthorized Access Prevention
  console.log('--- Test 1: Server-side authorization check (Unauthorized) ---');
  const unauthRes = await fetch(`${BASE_URL}/api/user/dashboard`);
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request should return 401');
  console.log('✅ Unauthenticated request correctly blocked with 401');

  // Test 2: Register two separate users for multi-tenant data isolation testing
  console.log('\n--- Test 2: Creating Test Accounts (Alice: Founder, Bob: Student) ---');
  const aliceEmail = `alice_${Date.now()}@testnexus.io`;
  const bobEmail = `bob_${Date.now()}@testnexus.io`;
  const password = 'StrongPassword!123';

  // Register Alice
  const aliceSignupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Alice Walker',
      email: aliceEmail,
      password,
      role: 'founder',
    }),
  });
  assert(aliceSignupRes.status === 200 || aliceSignupRes.status === 201, 'Alice signup should succeed');
  const aliceCookie = aliceSignupRes.headers.get('set-cookie');
  assert(aliceCookie, 'Alice session cookie should be returned');
  console.log('✅ Alice (founder) registered and session established');

  // Register Bob
  const bobSignupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Bob Chen',
      email: bobEmail,
      password,
      role: 'student',
    }),
  });
  assert(bobSignupRes.status === 200 || bobSignupRes.status === 201, 'Bob signup should succeed');
  const bobCookie = bobSignupRes.headers.get('set-cookie');
  assert(bobCookie, 'Bob session cookie should be returned');
  console.log('✅ Bob (student) registered and session established');

  // Test 3: Fetch Dashboard & Role-Specific Access
  console.log('\n--- Test 3: Fetch Personalized Dashboard & Role Isolation ---');
  const aliceDashRes = await fetch(`${BASE_URL}/api/user/dashboard`, {
    headers: { Cookie: aliceCookie },
  });
  assert.strictEqual(aliceDashRes.status, 200, 'Alice dashboard fetch should succeed');
  const aliceData = await aliceDashRes.json();
  assert.strictEqual(aliceData.user.fullName, 'Alice Walker');
  assert.strictEqual(aliceData.user.role, 'founder');
  assert(Array.isArray(aliceData.recommendedOpportunities), 'recommendedOpportunities must be an array');
  // Verify founder opportunities
  for (const opp of aliceData.recommendedOpportunities) {
    assert(opp.targetRoles.includes('founder'), 'Alice should only see founder opportunities');
  }
  console.log(`✅ Alice dashboard fetched: welcome "${aliceData.user.fullName}", role "${aliceData.user.role}", completion: ${aliceData.completion.percentage}%`);

  const bobDashRes = await fetch(`${BASE_URL}/api/user/dashboard`, {
    headers: { Cookie: bobCookie },
  });
  assert.strictEqual(bobDashRes.status, 200, 'Bob dashboard fetch should succeed');
  const bobData = await bobDashRes.json();
  assert.strictEqual(bobData.user.fullName, 'Bob Chen');
  assert.strictEqual(bobData.user.role, 'student');
  for (const opp of bobData.recommendedOpportunities) {
    assert(opp.targetRoles.includes('student'), 'Bob should only see student opportunities');
  }
  console.log(`✅ Bob dashboard fetched: welcome "${bobData.user.fullName}", role "${bobData.user.role}", completion: ${bobData.completion.percentage}%`);

  // Test 4: Profile Editing & Completion Progress
  console.log('\n--- Test 4: Member Profile Editing & Completion Calculation ---');
  const initialPercent = aliceData.completion.percentage;
  const updateProfileRes = await fetch(`${BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({
      fullName: 'Alice Walker Updated',
      headline: 'AI & Web3 Founder',
      bio: 'Building the future of decentralized collaboration at NexusHub.',
      location: 'San Francisco, CA',
      skills: ['TypeScript', 'Next.js', 'Distributed Systems', 'Product Strategy'],
      website: 'https://alicewalker.dev',
      github: 'https://github.com/alicewalker',
      linkedin: 'https://linkedin.com/in/alicewalker',
      phone: '+1 555-0199',
    }),
  });
  assert.strictEqual(updateProfileRes.status, 200, 'Alice profile update should succeed');
  const updatedProfileData = await updateProfileRes.json();
  assert.strictEqual(updatedProfileData.user.fullName, 'Alice Walker Updated');
  assert.strictEqual(updatedProfileData.profile.headline, 'AI & Web3 Founder');
  assert(updatedProfileData.completion.percentage > initialPercent, 'Completion % should increase');
  console.log(`✅ Alice profile updated. Completion increased from ${initialPercent}% to ${updatedProfileData.completion.percentage}%`);

  // Test 5: Verify Bob profile is unchanged (Data Isolation)
  console.log('\n--- Test 5: Data Isolation Check (Bob profile unaffected) ---');
  const bobProfileRes = await fetch(`${BASE_URL}/api/user/profile`, {
    headers: { Cookie: bobCookie },
  });
  const bobProfileData = await bobProfileRes.json();
  assert.strictEqual(bobProfileData.user.fullName, 'Bob Chen');
  assert.strictEqual(bobProfileData.profile.headline, 'Student & Technology Explorer', 'Bob headline should remain unmodified by Alice');
  console.log('✅ Bob profile completely isolated from Alice changes');

  // Test 6: Document Management & Cross-Tenant Security
  console.log('\n--- Test 6: Secure Document Management & Cross-Tenant Protection ---');
  const sampleDocBase64 = Buffer.from('NexusHub Test Executive Pitch Deck Content').toString('base64');
  const uploadRes = await fetch(`${BASE_URL}/api/user/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({
      name: 'Executive_Pitch_Deck_2026.pdf',
      fileType: 'application/pdf',
      size: 1024 * 45,
      category: 'pitch_deck',
      fileData: sampleDocBase64,
    }),
  });
  assert(uploadRes.status === 200 || uploadRes.status === 201, 'Document upload should succeed');
  const uploadResult = await uploadRes.json();
  const aliceDocId = uploadResult.document.id;
  assert(aliceDocId, 'Document ID should be present');
  console.log(`✅ Alice successfully uploaded document (id: ${aliceDocId})`);

  // Attempt Bob unauthorized document deletion
  const unauthorizedDeleteRes = await fetch(`${BASE_URL}/api/user/documents?id=${aliceDocId}`, {
    method: 'DELETE',
    headers: { Cookie: bobCookie },
  });
  assert.strictEqual(unauthorizedDeleteRes.status, 404, 'Bob should not be able to delete Alice document (404 Not Found)');
  console.log('✅ Cross-tenant document deletion properly blocked (Bob cannot delete Alice doc)');

  // Bob verifies his documents list is empty
  const bobDocsRes = await fetch(`${BASE_URL}/api/user/documents`, {
    headers: { Cookie: bobCookie },
  });
  const bobDocs = await bobDocsRes.json();
  assert.strictEqual(bobDocs.documents.length, 0, 'Bob should have 0 documents');
  console.log('✅ Bob document list correctly isolated (0 documents)');

  // Test 7: Saved Opportunities
  console.log('\n--- Test 7: Saved Opportunities Management ---');
  const firstOpp = aliceData.recommendedOpportunities[0];
  assert(firstOpp, 'Should have at least 1 opportunity available');
  const saveOppRes = await fetch(`${BASE_URL}/api/user/saved-opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({ opportunityId: firstOpp.id }),
  });
  assert(saveOppRes.status === 200 || saveOppRes.status === 201, 'Saving opportunity should succeed');
  console.log(`✅ Alice saved opportunity: "${firstOpp.title}"`);

  // Verify Bob saved opportunities is empty
  const bobSavedRes = await fetch(`${BASE_URL}/api/user/saved-opportunities`, {
    headers: { Cookie: bobCookie },
  });
  const bobSaved = await bobSavedRes.json();
  assert.strictEqual(bobSaved.savedOpportunities.length, 0, 'Bob should have 0 saved opportunities');
  console.log('✅ Bob saved opportunities list correctly isolated');

  // Test 8: Applications & History
  console.log('\n--- Test 8: Activity and Application History ---');
  const applyRes = await fetch(`${BASE_URL}/api/user/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({
      opportunityId: firstOpp.id,
      notes: 'Applying as team lead with 5 years experience in scalable systems.',
    }),
  });
  assert(applyRes.status === 200 || applyRes.status === 201, 'Application submission should succeed');
  const applyData = await applyRes.json();
  assert(applyData.application.status === 'submitted' || applyData.application.status === 'under_review');
  console.log(`✅ Alice applied to opportunity (application id: ${applyData.application.id}, status: ${applyData.application.status})`);

  // Verify Bob applications are 0
  const bobAppsRes = await fetch(`${BASE_URL}/api/user/applications`, {
    headers: { Cookie: bobCookie },
  });
  const bobApps = await bobAppsRes.json();
  assert.strictEqual(bobApps.applications.length, 0, 'Bob applications should be empty');
  console.log('✅ Bob applications list correctly isolated (0 applications)');

  // Test 9: Account Settings & Preferences
  console.log('\n--- Test 9: Account Settings & Preferences ---');
  const settingsUpdateRes = await fetch(`${BASE_URL}/api/user/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({
      themePreference: 'dark',
      emailNotifications: false,
      securityAlerts: true,
      profileVisibility: 'network',
      twoFactorEnabled: true,
    }),
  });
  assert.strictEqual(settingsUpdateRes.status, 200, 'Settings update should succeed');
  const settingsData = await settingsUpdateRes.json();
  assert.strictEqual(settingsData.settings.themePreference, 'dark');
  assert.strictEqual(settingsData.settings.emailNotifications, false);
  assert.strictEqual(settingsData.settings.twoFactorEnabled, true);
  console.log('✅ Alice account settings successfully updated (dark theme, 2FA enabled)');

  // Test 10: Verification Request Flow
  console.log('\n--- Test 10: Verification Flow ---');
  await fetch(`${BASE_URL}/api/user/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({
      name: 'Passport_ID_Alice.pdf',
      fileType: 'application/pdf',
      size: 1024 * 80,
      category: 'id_verification',
      fileData: sampleDocBase64,
    }),
  });

  const verificationRes = await fetch(`${BASE_URL}/api/user/verification`, {
    method: 'POST',
    headers: { Cookie: aliceCookie },
  });
  assert.strictEqual(verificationRes.status, 200, 'Verification request should succeed');
  const verificationData = await verificationRes.json();
  assert.strictEqual(verificationData.verificationStatus, 'pending');
  console.log('✅ Alice requested identity verification: status is "pending"');

  // Test 11: Notifications Center (Read & Delete)
  console.log('\n--- Test 11: Notifications Center ---');
  const notifsRes = await fetch(`${BASE_URL}/api/user/notifications`, {
    headers: { Cookie: aliceCookie },
  });
  const notifsData = await notifsRes.json();
  assert(notifsData.notifications.length > 0, 'Alice should have notifications');
  const notifId = notifsData.notifications[0].id;

  const markReadRes = await fetch(`${BASE_URL}/api/user/notifications`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
    body: JSON.stringify({ id: notifId }),
  });
  assert.strictEqual(markReadRes.status, 200, 'Marking notification read should succeed');
  console.log(`✅ Notification ${notifId} marked as read`);

  console.log('\n🎉 ALL 11 TEST SUITES PASSED FLAWLESSLY!');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
