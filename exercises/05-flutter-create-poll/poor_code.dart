import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CreatePollPage extends StatefulWidget {
  @override
  State<CreatePollPage> createState() => _CreatePollPageState();
}

class _CreatePollPageState extends State<CreatePollPage> {
  final questionController = TextEditingController();
  List<TextEditingController> optionControllers = [
    TextEditingController(),
    TextEditingController(),
  ];
  bool loading = false;

  void addOption() {
    setState(() {
      optionControllers.add(TextEditingController());
    });
  }

  void submit() async {
    setState(() => loading = true);

    final response = await http.post(
      Uri.parse('https://api.example.com/polls'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'question': questionController.text,
        'options': optionControllers.map((c) => c.text).toList(),
      }),
    );

    setState(() => loading = false);

    if (response.statusCode == 201) {
      Navigator.pop(context);
    } else {
      print('Error: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Create Poll')),
      body: Column(
        children: [
          TextField(
            controller: questionController,
            decoration: InputDecoration(labelText: 'Question'),
          ),
          ...optionControllers.map(
            (c) => TextField(
              controller: c,
              decoration: InputDecoration(labelText: 'Option'),
            ),
          ),
          ElevatedButton(onPressed: addOption, child: Text('Add Option')),
          loading
              ? CircularProgressIndicator()
              : ElevatedButton(onPressed: submit, child: Text('Submit')),
        ],
      ),
    );
  }
}
