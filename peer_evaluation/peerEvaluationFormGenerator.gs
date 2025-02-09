function onOpen() {
  const spreadsheet = SpreadsheetApp.getActive();
  const groupsSheet = spreadsheet.getSheetByName("Grupos");
  const functions = groupsSheet ? ["generateFormFase2", "generateFormFase3"] : ["requestGroupsSheet", "requestGroupsSheet"];
  const menuItems = [{name: 'Generar enecuesta Fase 2', functionName: functions[0]}, 
                   {name: 'Generar enecuesta Fase 3', functionName: functions[1]}];
  spreadsheet.addMenu('Evaluación de Pares', menuItems);
}

function requestGroupsSheet() {
  Browser.msgBox('Debe existir una hoja llamada "Grupos" con los nombres de los alumnos y el número de su grupo.');
}

function getDataStudents(){
  let groups = {};
  let students = [];
  const spreadsheet = SpreadsheetApp.getActive();
  const groupsSheetData = spreadsheet.getSheetByName("Grupos").getDataRange().getValues();
  const width = groupsSheetData[0].length;
  const height = groupsSheetData.length;
  
  for (row = 1; row < height; row++) {
    if (!(groupsSheetData[row][1] in groups)) {
      groups[groupsSheetData[row][1]] = [groupsSheetData[row][0]];
    } else {
      groups[groupsSheetData[row][1]].push(groupsSheetData[row][0]);
    }
    students.push(groupsSheetData[row][0]);
  }
   
  return [groups, students];
}



function generateForm(phase, activitiesOptions){
  const form = FormApp.create("Evaluación de Pares Pensamiento Visual - Fase " + phase);
  form.setCollectEmail(true)
   .setDescription("El siguiente documento es la Evaluación de Pares de la Fase " + phase +". En ella deberás evaluar el trabajo de tus compañer@s de grupo. Recuerda seguir las instrucciones subidas a la plataforma del curso.");
  const dataStudents = getDataStudents();
  const groups = dataStudents[0];
  const students = dataStudents[1];
  const evaluationOptions = ["1", "2", "3", "4", "5", "Este soy yo."];
  let groupsListString = "";
  const groupsList =  Object.keys(groups);
  for (var groupNumber = 0; groupNumber < groupsList.length; groupNumber++) { 
    groupsListString += "Grupo " + (groupNumber + 1).toString() + ": " + groups[groupsList[groupNumber]] + "\n";
  };
  
  const selectGroupSection = form.addPageBreakItem()
    .setTitle("Evaluación de Pares")
    .setHelpText("Escoge tu grupo en la siguiente lista: \n" + groupsListString);
  
  
  const groupItem = form.addListItem();
  groupItem.setTitle("Grupo")
   .setChoiceValues(groupsList)
   .setRequired(true);
  
  for (let groupNumber = 0; groupNumber < groupsList.length; groupNumber++) {
    
    const groupNamesList = groups[groupsList[groupNumber]];
    const pointsToGive = 3*(groupNamesList.length - 1) + 1
    
    const groupSection = form.addPageBreakItem()
      .setTitle("Grupo " + (groupNumber + 1).toString())
      .setHelpText('Explicación Notas:\n 1.0 – No trabajó/aportó en el desarrollo del proyecto.\n 2.0 – Insuficiente: no trabajó/aportó lo suficiente. Su participación en el proyecto es menor a la que corresponde.\n 3.0 – Cumple con trabajar en el proyecto, pero su participación no sobresale: “ley del mínimo esfuerzo”.\n 4.0 – Competente: su trabajo/aporte al proyecto es relevante, trabajando más de lo que corresponde.\n 5.0 – Distinguido: su trabajo/aporte sobresalió claramente dentro de los integrantes del grupo.\n\n Elige un puntaje entre 1 y 5 para cada uno de tus compañeros. Cuando salga tu nombre marca “Este soy yo” y NO te pongas nota a tí.\n\n Para cada una de las 3 preguntas tienes ' + pointsToGive + ' puntos para repartir entre tus compañeros. No tienes que usar todos los puntos pero si te pasas se entenderá que le pusiste a todos los integrantes de tu grupo 3.0 puntos.')
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);
    
    const reunionesItem = form.addGridItem();
    reunionesItem.setTitle("Reuniones")
      .setRows(groupNamesList)
      .setColumns(evaluationOptions)
      .setRequired(true)
      .setHelpText("Contribución a las reuniones de equipo: Tomando en cuenta la disponibilidad y participación en las reuniones y actividades del equipo ¿Cuántos puntos le darías a tus compañeros?");
    
    const aporteItem = form.addGridItem();
    aporteItem.setTitle("Aporte")
      .setRows(groupNamesList)
      .setColumns(evaluationOptions)
      .setRequired(true)
      .setHelpText("Aporte individual fuera de las reuniones y actividades de equipo: Tomando en cuenta si realiza las tareas asignadas por el equipo en el plazo estipulado y si su trabajo es riguroso potenciando al equipo ¿Cuántos puntos le darías a tus compañeros? ");
    
    const climaItem = form.addGridItem();
    climaItem.setTitle("Clima")
      .setRows(groupNamesList)
      .setColumns(evaluationOptions)
      .setRequired(true)
      .setHelpText("Promueve un clima de equipo constructivo transmitiendo una actitud positiva y respetuosa hacia el trabajo y equipo ¿Cuántos puntos le darías a tus compañeros?");
    
    const actividadesItem = form.addCheckboxGridItem();
    actividadesItem.setTitle("Marca en qué actividad/es contribuyeron tus compañeros")
      .setRows(groupNamesList)
      .setColumns(activitiesOptions);
    
    const comentariosItem = form.addTextItem();
    comentariosItem.setTitle("Si quieres agregar otras actividades o comentarios que justifiquen tu criterio, esta es la sección para realizarlo");
  }
      
}

function generateFormFase2(){
  const activitiesOptions = ["Programación", "Interfaz", "Testeos", "Videos", "Otras"];
  generateForm(2, activitiesOptions);
}

function generateFormFase3(){
  const activitiesOptions = ["Arduino", "Prototipado", "Testeos", "Videos", "Otras"];
  generateForm(3, activitiesOptions);
}
