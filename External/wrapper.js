require('./methods.js');

////////////////////////
/*      Wrapper       */
////////////////////////


global.retrieveAPIData = async function retrieveAPIData(methodName, selection, queue, targetName, extraData) {

  /* Initialize local variables */
  let link = '';
  let optionalData = '';
  let returnData = '';

  let signature = await createSignature(methodName);   // Create signature
  if (selection != 4) displayCall(methodName);         // Display Method

  /* Retrieve extra information recursively, if necessary. Create new signature to account for delay */
  switch (methodName) {                                
    case 'getgodskins':
    case 'getgodrecommendeditems':
    case 'getgodleaderboard':
      targetName = await retrieveGodID(targetName);
      signature = await createSignature(methodName);
    break;
    case 'getplayerachievements':
    case 'getqueuestats':
      targetName = await retrievePlayerID(targetName);
      signature = await createSignature(methodName);
    break;
  }

  /* Fetch data and be mindful of errors */
  try {
    link = await determineLinkFormat(methodName, targetName, signature, queue, extraData); // Format link
  } catch (e) { console.log(red, '\n' + e + '\n'); return; }
  
  try { returnData = await fetchData(link); } // Fetch data
  catch (e) { 
    console.log(red, '\n' + e + '\n');
    return;
  }

  // Handle data based on method. If recursively called, return data.
  if (selection != 4) 
    await handleData(data, selection, link, methodName, targetName + queue);
  else
    return data;
  
}
